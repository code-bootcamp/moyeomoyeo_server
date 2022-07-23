import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/apis/post/entities/post.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  src: string;

  @CreateDateColumn()
  @Field(() => Date)
  uploadedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @ManyToOne(() => Product, (product) => product.images)
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => Post, (post) => post.images)
  @Field(() => Post)
  post: Post;
}
