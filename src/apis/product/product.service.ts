import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create({ productInput }) {
    const result = await this.productRepository.save({
      ...productInput,
    });
    return result;
  }

  async update() {}

  async findAll() {}

  async findOne() {}

  async delete() {}
}
