import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
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
    const { imgSrcs, ...updateInfo } = updateProductInput;
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller', 'transaction', 'likedUsers', 'comments', 'images'],
    });
    if (!imgSrcs) {
      return await this.productRepository.save({
        ...productFound,
        ...updateInfo,
      });
    }
    const newImgList = await Promise.all(
      imgSrcs.map((element) => {
        return this.imageService.create({ src: element });
      }),
    );
    const updatedProduct = await this.productRepository.save({
      ...productFound,
      ...updateInfo,
      images: newImgList,
    });
    return updatedProduct;
  }

  async findAll({ page, pageSize }) {
    if (!page || !pageSize) {
      return await this.productRepository.find({
        // prettier-ignore
        relations: ['images', 'seller', 'transaction',
        'comments', 'comments.parent', 'comments.children', 'likedUsers'],
      });
    }
    const products = await this.productRepository.find({
      // prettier-ignore
      relations: ['images', 'seller', 'transaction',
      'comments', 'comments.parent', 'comments.children', 'likedUsers'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return products;
  }

  async findOne({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['images', 'seller', 'transaction', 'comments', 'likedUsers'],
    });
    const prevCount = product.viewCount;
    // prettier-ignore
    await this.productRepository.update(
      { id: productId }, { viewCount: prevCount + 1 },
    );
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
