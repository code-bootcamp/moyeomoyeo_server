import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { CommentInput } from './dto/comment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  fetchComments() {
    return this.commentService.fetchComments();
  }

  @Query(() => [Comment])
  fetchProductComments(
    @Args('productId') productId: string,
    @Args('page', { nullable: true }) page: number,
    @Args('pageSize', { nullable: true }) pageSize: number,
  ) {
    return this.commentService.fetchProductComments({
      productId,
      page,
      pageSize,
    });
  }

  @Query(() => [Comment])
  fetchBoardComments(
    @Args('boardId') boardId: string,
    @Args('page', { nullable: true }) page: number,
    @Args('pageSize', { nullable: true }) pageSize: number,
  ) {
    return this.commentService.fetchBoardComments({ boardId, page, pageSize });
  }

  @Query(() => Comment)
  fetchComment(@Args('commentId') commentId: string) {
    return this.commentService.fetchComment({ commentId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Comment)
  createProductComment(
    @Args('commentInput') commentInput: CommentInput,
    @Args('productId') productId: string,
    @TargetUser() targetUser: any,
  ) {
    return this.commentService.createProductComment({
      productId,
      commentInput,
      targetUser,
    });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Comment)
  createBoardComment(
    @Args('commentInput') commentInput: CommentInput,
    @Args('boardId') boardId: string,
    @TargetUser() targetUser: any,
  ) {
    return this.commentService.createBoardComment({
      boardId,
      commentInput,
      targetUser,
    });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Boolean)
  deleteComment(@Args('commentId') commentId: string) {
    return this.commentService.delete({ commentId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Boolean)
  deleteComments() {
    return this.commentService.deleteAll();
  }
}
