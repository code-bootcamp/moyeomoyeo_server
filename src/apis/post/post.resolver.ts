import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { PostInput } from './dto/post.input';
import { UpdatePostInput } from './dto/updatePost.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(
    private readonly postService: PostService, //
  ) {}

  @Query(() => [Post])
  fetchPosts() {
    return this.postService.findAll();
  }

  @Query(() => Post)
  fetchPost(
    @Args('postId') postId: string, //
  ) {
    return this.postService.findOne({ postId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Post)
  createPost(
    @TargetUser() payload: any,
    @Args('postInput') postInput: PostInput, //
  ) {
    return this.postService.create({ payload, postInput });
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('postId') postId: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput, //
  ) {
    return this.postService.update({ postId, updatePostInput });
  }

  @Mutation(() => Boolean)
  deletePost(@Args('postId') postId: string) {
    return this.postService.delete({ postId });
  }
}
