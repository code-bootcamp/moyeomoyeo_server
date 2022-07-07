import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event } from 'src/apis/event/entities/event.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
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

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isSubscribed: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  isAdmin: boolean;

  @Column({ nullable: true })
  @Field(() => String)
  institution: string;

  @Column({ nullable: true })
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
