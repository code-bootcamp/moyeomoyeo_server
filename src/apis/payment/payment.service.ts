import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Product } from '../product/entities/product.entity';
import { Payment, PAYMENT_STATUS } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly iamportService: IamportService,
    private readonly connection: Connection,
  ) {}

  async create({ impUid, productId, targetUser }) {
    const access_token = await this.iamportService.getToken();
    const data = await this.iamportService.getPaymentData({
      access_token,
      impUid,
    });
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
    });

    // 체크 진행
    await this.checkAmount({ data, price: productFound.price });
    await this.checkDuplicate({ impUid });

    // Query Runner 설정: ROLL-BACK
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const transaction = this.paymentRepository.create({
        impUid,
        status: PAYMENT_STATUS.PAYMENT,
        payAmount: productFound.price,
        buyer: targetUser,
      });
      await queryRunner.manager.save(transaction);

      const productSold = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });
      const updatedProduct = await this.productRepository.create({
        ...productSold,
        isSoldout: true,
        transaction,
      });
      await queryRunner.manager.save(updatedProduct);
      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({ impUid, productId, targetUser }) {
    const paymentFound = await this.paymentRepository.find({
      where: { impUid },
    });
    if (paymentFound.length > 1)
      throw new UnprocessableEntityException(
        'Error 422: 이미 환불이 완료되었습니다.',
      );
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
    });

    const access_token = await this.iamportService.getToken();
    await this.iamportService.requestCancel({
      access_token,
      impUid,
      price: productFound.price,
    });

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const cancelTransaction = this.paymentRepository.create({
        impUid,
        status: PAYMENT_STATUS.CANCELLATION,
        payAmount: productFound.price,
        buyer: targetUser,
      });
      await queryRunner.manager.save(cancelTransaction);

      const productSold = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedProduct = await this.productRepository.create({
        ...productSold,
        isSoldout: false,
        transaction: null,
      });
      await queryRunner.manager.save(updatedProduct);
      await queryRunner.commitTransaction();

      return cancelTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkAmount({ data, price }) {
    if (data.amount === price) return;
    else
      throw new BadRequestException(
        'Error 400: 결제된 내역이 상품 가격과 일치하지 않습니다. 금액을 다시 확인해주세요.',
      );
  }

  async checkDuplicate({ impUid }) {
    const paymentFound = await this.paymentRepository.findOne({
      where: { impUid },
    });
    if (paymentFound)
      throw new ConflictException('Error 409: 이미 결제가 완료되었습니다.');
  }
}