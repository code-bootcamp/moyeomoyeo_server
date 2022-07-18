import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async fetchComments() {
    const treeManager = this.manager.getTreeRepository(Comment);
    const comments = await treeManager.findTrees({
      relations: ['parentProduct', 'children', 'parent'],
    });
    return comments;

    // return await this.commentRepository
    //   .createQueryBuilder('comment')
    //   .leftJoinAndSelect('comment.parentProduct', 'product')
    //   .leftJoinAndSelect('comment.children', 'cc')
    //   .leftJoinAndSelect('cc.children', 'ccc')
    //   .getMany();
  }

  async fetchComment({ commentId }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const mainComment = await treeManager.findOne({
      where: { id: commentId },
      relations: ['parentProduct', 'children', 'parent'],
    });
    const comment = await treeManager.findDescendantsTree(mainComment);
    return comment;
  }

  async create({ productId, commentInput }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['mainImage', 'subImages', 'seller', 'transaction', 'likedUsers'],
    });
    try {
      if (!commentInput.parentId) {
        return await treeManager.save({
          content: commentInput.content,
          parentProduct: productFound,
        });
      }
      const mainComment = await treeManager.findOne({
        where: { id: commentInput.parentId },
        relations: ['parentProduct', 'children', 'parent'],
      });
      const subComment = await treeManager.save({
        content: commentInput.content,
        parent: mainComment,
        parentProduct: productFound,
      });
      return subComment;
    } catch (error) {
      throw error;
    }
  }

  async delete({ commentId }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const result = await treeManager.softDelete({ id: commentId });
    return result.affected ? true : false;
  }

  async deleteAll() {
    const treeManager = this.manager.getTreeRepository(Comment);
    await treeManager.update({}, { parent: null });
    const result = await treeManager.delete({});
    return result.affected ? true : false;
  }
}
