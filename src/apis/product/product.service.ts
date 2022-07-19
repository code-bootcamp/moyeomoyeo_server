import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly imageService: ImageService,
  ) {}

  async create({ targetUser, productInput }) {
    const { mainImgSrc, imgSrcs, ...productInfo } = productInput;
    const seller = await this.userRepository.findOne({
      where: { email: targetUser.email },
    });
    const images = await Promise.all(
      imgSrcs.map((element: string) => {
        return this.imageService.create({ src: element });
      }),
    );
    // prettier-ignore
    const result = await this.productRepository.save({ 
      seller, images, ...productInfo 
    });
    return result;
  }

  async update({ productId, updateProductInput }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    const updatedProduct = {
      ...product,
      ...updateProductInput,
    };

    return await this.productRepository.save(updatedProduct);
  }

  async findAll() {
    const products = await this.productRepository.find({
      // prettier-ignore
      relations: ['images', 'seller', 'transaction', 'comments'],
    });
    return products;
  }

  async findOne({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['images', 'seller', 'transaction', 'comments'],
    });
    return product;
  }

  async delete({ productId }) {
    const result = await this.productRepository.softDelete({ id: productId });
    return result.affected ? true : false;
  }

  async dibs({ targetUser, productId }) {
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });

    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: [ 'images', 'seller', 'transaction', 'likedUsers'],
    });

    let userArr = productFound.likedUsers;
    if (!userArr) userArr = [];
    for (let i = 0; i < productFound.likedUsers.length; i++) {
      const user = productFound.likedUsers[i];
      if (user.id === userFound.id) return productFound.likedUsers;
    }

    userArr.push(userFound);
    const updatedProduct = await this.productRepository.save({
      ...productFound,
      likedUsers: userArr,
    });
    return updatedProduct.likedUsers;
  }

  async cancelDibs({ targetUser, productId }) {
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: [ 'images', 'seller', 'transaction', 'likedUsers'],
    });
    let userArr = productFound.likedUsers;

    const updatedUserList = userArr.filter((element) => {
      return element.email !== targetUser.email;
    });

    const updatedProduct = await this.productRepository.save({
      ...productFound,
      likedUsers: updatedUserList,
    });
    return updatedProduct.likedUsers;
  }
}
