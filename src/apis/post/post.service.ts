import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ payload, postInput }) {
    const { ...input } = postInput;

    // 유저 찾기
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    const result = await this.postRepository.save({
      ...input,
      writer: user,
      //아마 카테고리 ?
    });

    return result;
  }

  async delete({ postId }) {
    const result = await this.postRepository.softDelete({ id: postId });
    return result.affected ? true : false;
  }

  async update({ postId, updatePostInput }) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    const newpost = {
      ...post,
      id: postId,
      ...updatePostInput,
    };

    return await this.postRepository.save(newpost);
  }

  async findAll() {
    return await this.postRepository.find();
  }
  async findOne({ postId }) {
    return await this.postRepository.findOne({ where: { id: postId } });
  }
}
