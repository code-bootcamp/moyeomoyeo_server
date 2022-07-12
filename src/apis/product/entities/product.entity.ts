import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payment/entities/payment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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

  @Column()
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

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @Column()
  @Field(() => String)
  imgSrc: string;

  @ManyToOne(() => User)
  @Field(() => User)
  seller: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  transaction: Payment;

  @ManyToMany(() => User, (likedUsers) => likedUsers.dibsProducts)
  @Field(() => [User])
  likedUsers: User[];
}
