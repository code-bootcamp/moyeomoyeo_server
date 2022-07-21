import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Accompany } from 'src/apis/accompany/entities/accompany.entity';
import { BoardAddress } from 'src/apis/address/entities/Board.address.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Image } from 'src/apis/image/entities/image.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
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
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  viewCount: number;

  @Column({ default: 1 })
  @Field(() => Int)
  personCount: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isFull: boolean;

  @Column(() => Date)
  @Field(() => Date)
  dateStart: Date;

  @Column(() => Date)
  @Field(() => Date)
  dateEnd: Date;

  @Column('simple-array')
  @Field(() => [String])
  transport: string[];

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @ManyToOne(() => Post)
  @Field(() => Post)
  parentPost: Post;

  @ManyToMany(() => User, (scheduledUsers) => scheduledUsers.scheduledBoards)
  @Field(() => [User])
  scheduledUsers: User[];

  @JoinColumn()
  @OneToOne(() => BoardAddress)
  @Field(() => BoardAddress)
  boardAddress: BoardAddress;

  @JoinTable()
  @OneToMany(() => Comment, (comments) => comments.parentBoard)
  @Field(() => [Comment])
  comments: Comment[];

  @JoinColumn()
  @OneToOne(() => Image)
  @Field(() => Image)
  coverImage: Image;

  @JoinTable()
  @OneToMany(() => Accompany, (accompany) => accompany.board)
  @Field(() => [Accompany])
  accompanyRequests: Accompany[];
}
