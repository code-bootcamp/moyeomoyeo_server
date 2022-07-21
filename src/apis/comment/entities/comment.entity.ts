import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Tree('closure-table')
@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column()
  @Field(() => String)
  content: string;

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @TreeChildren({ cascade: true })
  @Field(() => [Comment], { nullable: true })
  children: Comment[];

  @TreeParent()
  @Field(() => Comment, { nullable: true })
  parent: Comment;

  @ManyToOne(() => Product, (parentProduct) => parentProduct.comments, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field(() => Product, { nullable: true })
  parentProduct: Product;

  @ManyToOne(() => Board, (parentBoard) => parentBoard.comments, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @Field(() => Board, { nullable: true })
  parentBoard: Board;
}
