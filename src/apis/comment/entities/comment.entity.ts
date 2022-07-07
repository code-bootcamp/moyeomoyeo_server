import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/product/entities/product.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn() //type: "timestamp?"
  @Field(() => String)
  createdAt: Date;

  @Column()
  @Field(() => String)
  content: string;

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @ManyToOne(() => Product)
  @Field(() => Product)
  parentProduct: Product;
}
