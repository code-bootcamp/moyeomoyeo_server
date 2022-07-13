import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create({ productInput }) {
    const { userId, mainImgSrc, subImgSrcs, ...productInfo } = productInput;
    const seller = await this.userRepository.findOne({ where: { id: userId } });
    const mainImage = await this.imageRepository.findOne({
      where: { src: mainImgSrc },
    });
    const subImages = await Promise.all(
      subImgSrcs.map((el) => {
        return this.imageRepository.findOne({ where: { src: el } });
      }),
    );
    // prettier-ignore
    const result = await this.productRepository.save({ 
      seller, mainImage, subImages, ...productInfo 
    });
    return result;
  }

  async update() {}

  async findAll() {
    const products = await this.productRepository.find({
      // prettier-ignore
      relations: ['mainImage', 'subImages', 'seller', 'transaction', 'likedUsers'],
    });
    return products;
  }

  async findOne({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['mainImage', 'subImages', 'seller', 'transaction', 'likedUsers'],
    });
    return product;
  }

  async delete({ productId }) {
    const result = await this.productRepository.softDelete({ id: productId });
    return result.affected ? true : false;
  }
}
