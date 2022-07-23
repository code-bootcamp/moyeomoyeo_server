import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async fetchComments() {
    const treeManager = this.manager.getTreeRepository(Comment);
    const comments = await treeManager.findTrees({
      relations: [
        'parentProduct',
        'parentBoard',
        'children',
        'parent',
        'writer',
      ],
    });
    return comments;

    // return await this.commentRepository
    //   .createQueryBuilder('comment')
    //   .leftJoinAndSelect('comment.parentProduct', 'product')
    //   .leftJoinAndSelect('comment.children', 'cc')
    //   .leftJoinAndSelect('cc.children', 'ccc')
    //   .getMany();
  }

  async fetchProductComments({ productId, page, pageSize }) {
    const comments = await this.fetchComments();
    const productComments = comments.filter((element) => {
      if (element.parentProduct) return element.parentProduct.id === productId;
    });
    if (!page || !pageSize) return productComments;
    const paginated = [];
    for (let i = (page - 1) * pageSize; i < page * pageSize; i++) {
      if (productComments[i]) paginated.push(productComments[i]);
    }
    return paginated;
  }

  async fetchBoardComments({ boardId, page, pageSize }) {
    const comments = await this.fetchComments();
    const boardComments = comments.filter((element) => {
      if (element.parentBoard) return element.parentBoard.id === boardId;
    });
    if (!page || !pageSize) return boardComments;
    const paginated = [];
    for (let i = (page - 1) * pageSize; i < page * pageSize; i++) {
      if (boardComments[i]) paginated.push(boardComments[i]);
    }
    return paginated;
  }

  async fetchComment({ commentId }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const mainComment = await treeManager.findOne({
      where: { id: commentId },
      relations: ['parentProduct', 'children', 'parent', 'writer'],
    });
    const comment = await treeManager.findDescendantsTree(mainComment);
    return comment;
  }

  async createProductComment({ productId, commentInput, targetUser }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      // prettier-ignore
      relations: ['images', 'seller', 'transaction', 'likedUsers', 'comments'],
    });
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });
    try {
      if (!commentInput.parentId) {
        return await treeManager.save({
          content: commentInput.content,
          parentProduct: productFound,
          writer: userFound,
        });
      }
      const mainComment = await treeManager.findOne({
        where: { id: commentInput.parentId },
        relations: ['parentProduct', 'children', 'parent', 'writer'],
      });
      const subComment = await treeManager.save({
        content: commentInput.content,
        parent: mainComment,
        parentProduct: productFound,
        writer: userFound,
      });
      return subComment;
    } catch (error) {
      throw error;
    }
  }

  async createBoardComment({ boardId, commentInput, targetUser }) {
    const treeManager = this.manager.getTreeRepository(Comment);
    const boardFound = await this.boardRepository.findOne({
      where: { id: boardId },
      // prettier-ignore
      relations: ['writer', 'scheduledUsers', 'boardAddress', 'comments',
      'accompanyRequests', 'eventImage', 'coverImage' ],
    });
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });
    try {
      if (!commentInput.parentId) {
        return await treeManager.save({
          content: commentInput.content,
          parentBoard: boardFound,
          writer: userFound,
        });
      }
      const mainComment = await treeManager.findOne({
        where: { id: commentInput.parentId },
        relations: ['parentBoard', 'children', 'parent', 'writer'],
      });
      const subComment = await treeManager.save({
        content: commentInput.content,
        parent: mainComment,
        parentBoard: boardFound,
        writer: userFound,
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
