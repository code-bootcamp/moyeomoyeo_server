import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { Product } from '../product/entities/product.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async fetchComments() {
    const treeManager = this.manager.getTreeRepository(Comment);
    const comments = await treeManager.findTrees({
      relations: ['parentProduct', 'parentBoard', 'children', 'parent'],
    });
    return comments;

    // return await this.commentRepository
    //   .createQueryBuilder('comment')
    //   .leftJoinAndSelect('comment.parentProduct', 'product')
    //   .leftJoinAndSelect('comment.children', 'cc')
    //   .leftJoinAndSelect('cc.children', 'ccc')
    //   .getMany();
  }

  async fetchProductComments({ productId }) {
    const comments = await this.fetchComments();
    const productComments = comments.filter((element) => {
      return element.parentProduct.id === productId;
    });
    return productComments;
  }

  async fetchBoardComments({ boardId }) {
    const comments = await this.fetchComments();
    const boardComments = comments.filter((element) => {
      return element.parentBoard.id === boardId;
    });
    return boardComments;
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

  async createProductComment({ productId, commentInput }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['images', 'seller', 'transaction', 'likedUsers', 'comments'],
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

  async createBoardComment({ boardId, commentInput }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const boardFound = await this.boardRepository.findOne({
      where: { id: boardId },
      // prettier-ignore
      relations: ['writer', 'parentPost', 'parentEvent', 'scheduledUsers', 'boardAddress', 'comments' ],
    });
    try {
      if (!commentInput.parentId) {
        return await treeManager.save({
          content: commentInput.content,
          parentBoard: boardFound,
        });
      }
      const mainComment = await treeManager.findOne({
        where: { id: commentInput.parentId },
        relations: ['parentBoard', 'children', 'parent'],
      });
      const subComment = await treeManager.save({
        content: commentInput.content,
        parent: mainComment,
        parentBoard: boardFound,
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
