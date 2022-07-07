import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/apis/post/entities/post.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Event {
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
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => String)
  areaCode: string;

  @Column()
  @Field(() => String)
  imgSrc: string;

  @JoinColumn()
  @OneToOne(() => Post)
  @Field(() => Post)
  post: Post;

  @ManyToMany(() => User, (likedUsers) => likedUsers.dibsEvent)
  @Field(() => [User])
  likedUsers: User[];
}
