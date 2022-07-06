import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event } from 'src/apis/event/entities/event.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
  Column,
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

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Int)
  point: number;

  @Column()
  @Field(() => String)
  createdAt: Date;

  @Column()
  @Field(() => Boolean)
  isSubscribed: boolean;

  @Column()
  @Field(() => Boolean)
  isAdmin: boolean;

  @Column()
  @Field(() => String)
  institution: string;

  @Column()
  @Field(() => String)
  manager: string;

  @JoinTable()
  @ManyToMany(() => Product, (dibsProducts) => dibsProducts.likedUsers)
  @Field(() => [Product])
  dibsProducts: Product[];

  @JoinTable()
  @ManyToMany(() => Event, (dibsEvent) => dibsEvent.likedUsers)
  @Field(() => [Event])
  dibsEvent: Event[];
}
