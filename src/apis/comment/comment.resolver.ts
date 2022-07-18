import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
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

  @Query(() => Comment)
  fetchComment(@Args('commentId') commentId: string) {
    return this.commentService.fetchComment({ commentId });
  }

  @Mutation(() => Comment)
  createProductComment(
    @Args('commentInput') commentInput: CommentInput,
    @Args('productId') productId: string,
  ) {
    return this.commentService.create({ productId, commentInput });
  }

  @Mutation(() => Comment)
  deleteComment(@Args('commentId') commentId: string) {
    return this.commentService.delete({ commentId });
  }

  @Mutation(() => Boolean)
  deleteComments() {
    return this.commentService.deleteAll();
  }
}
