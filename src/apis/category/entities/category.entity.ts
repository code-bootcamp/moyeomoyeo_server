import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/apis/post/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Post, (posts) => posts.categories)
  @Field(() => [Post])
  posts: Post[];
}
