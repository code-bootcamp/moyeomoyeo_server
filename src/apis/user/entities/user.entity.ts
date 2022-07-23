import { Field, ObjectType } from '@nestjs/graphql';
import { Accompany } from 'src/apis/accompany/entities/accompany.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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
  @Field(() => Date)
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
  @OneToMany(() => Accompany, (scheduledBoards) => scheduledBoards.reqUser)
  @Field(() => [Accompany], { nullable: true })
  scheduledBoards: Accompany[];

  @ManyToMany(() => Board, (confirmedBoards) => confirmedBoards.scheduledUsers)
  @Field(() => [Board], { nullable: true })
  confirmedBoards: Board[];

  @ManyToMany(() => Product, (dibsProducts) => dibsProducts.likedUsers)
  @Field(() => [Product], { nullable: true })
  dibsProducts: Product[];

  @ManyToMany(() => Post, (dibsPosts) => dibsPosts.likedUsers)
  @Field(() => [Post], { nullable: true })
  dibsPosts: Post[];
}
