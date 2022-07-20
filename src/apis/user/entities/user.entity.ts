import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Event } from 'src/apis/event/entities/event.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isSubscribed: boolean;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  isAuth: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  isAdmin: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  institution: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  manager: string;

  @JoinTable()
  @ManyToMany(() => Board, (scheduledBoards) => scheduledBoards.scheduledUsers)
  @Field(() => [Board], { nullable: true })
  scheduledBoards: Board[];

  @ManyToMany(() => Product, (dibsProducts) => dibsProducts.likedUsers)
  @Field(() => [Product], { nullable: true })
  dibsProducts: Product[];

  @ManyToMany(() => Post, (dibsPosts) => dibsPosts.likedUsers)
  @Field(() => [Post], { nullable: true })
  dibsPosts: Post[];
}
