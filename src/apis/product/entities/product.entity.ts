import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Image } from 'src/apis/image/entities/image.entity';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  contentSrc: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ default: 0 })
  @Field(() => Int)
  viewCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @JoinTable()
  @OneToMany(() => Image, (images) => images.product)
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @ManyToOne(() => User)
  @Field(() => User)
  seller: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment, { nullable: true })
  transaction: Payment;

  @JoinTable()
  @ManyToMany(() => User, (likedUsers) => likedUsers.dibsProducts)
  @Field(() => [User], { nullable: true })
  likedUsers: User[];

  @JoinTable()
  @OneToMany(() => Comment, (comments) => comments.parentProduct)
  @Field(() => [Comment])
  comments: Comment[];
}
