import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly imageService: ImageService,
  ) {}

  async create({ targetUser, postInput }) {
    const { imgSrcs, ...postInfo } = postInput;

    // 유저 찾기
    const user = await this.userRepository.findOne({
      where: { email: targetUser.email },
    });

    if (!user.institution)
      throw new UnauthorizedException(
        'Error 401: 관계자 계정으로 다시 시도해주세요.',
      );

    // 이미지 리스트 불러오기
    const imagesList = await Promise.all(
      imgSrcs.map((element) => {
        return this.imageService.create({ src: element });
      }),
    );

    const result = await this.postRepository.save({
      images: imagesList,
      writer: user,
      ...postInfo,
    });

    return result;
  }

  async delete({ postId }) {
    const result = await this.postRepository.softDelete({ id: postId });
    return result.affected ? true : false;
  }

  async update({ postId, updatePostInput }) {
    const { imgSrcs, ...updateInfo } = updatePostInput;
    const postFound = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer', 'images', 'likedUsers'],
    });
    if (!imgSrcs) {
      return await this.postRepository.save({
        ...postFound,
        ...updateInfo,
      });
    }
    const newImgList = await Promise.all(
      imgSrcs.map((element) => {
        return this.imageService.create({ src: element });
      }),
    );
    const updatedPost = await this.postRepository.save({
      ...postFound,
      ...updateInfo,
      images: newImgList,
    });
    return updatedPost;
  }

  async findAll({ page, pageSize }) {
    if (!page || !pageSize) {
      return await this.postRepository.find({
        relations: ['images', 'likedUsers', 'writer'],
      });
    }
    return await this.postRepository.find({
      relations: ['images', 'likedUsers', 'writer'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
  async findOne({ postId }) {
    const result = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['images', 'likedUsers', 'writer'],
    });
    const prevCount = result.viewCount;
    // prettier-ignore
    await this.postRepository.update(
      { id: postId }, { viewCount: prevCount + 1 }
    )
    return result;
  }

  async dibs({ targetUser, postId }) {
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });

    const postFound = await this.postRepository.findOne({
      where: { id: postId },
      // prettier-ignore
      relations: ['writer', 'images', 'likedUsers'],
    });

    let userArr = postFound.likedUsers;
    if (!userArr) userArr = [];
    for (let i = 0; i < postFound.likedUsers.length; i++) {
      const user = postFound.likedUsers[i];
      if (user.id === userFound.id) return postFound.likedUsers;
    }

    userArr.push(userFound);
    const updatedPost = await this.postRepository.save({
      ...postFound,
      likedUsers: userArr,
    });
    return updatedPost.likedUsers;
  }

  async cancelDibs({ targetUser, postId }) {
    const postFound = await this.postRepository.findOne({
      where: { id: postId },
      // prettier-ignore
      relations: ['writer', 'images', 'likedUsers'],
    });
    let userArr = postFound.likedUsers;

    const updatedUserList = userArr.filter((element) => {
      return element.email !== targetUser.email;
    });

    const updatedPost = await this.postRepository.save({
      ...postFound,
      likedUsers: updatedUserList,
    });

    return updatedPost.likedUsers;
  }
}
