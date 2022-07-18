import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Image])],
  // controllers: [],
  providers: [PostResolver, PostService, ImageService],
})
export class PostModule {}
