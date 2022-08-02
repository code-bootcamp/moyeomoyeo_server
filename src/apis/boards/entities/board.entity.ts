import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Accompany } from 'src/apis/accompany/entities/accompany.entity';
import { BoardAddress } from 'src/apis/address/entities/Board.address.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Image } from 'src/apis/image/entities/image.entity';
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
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  remark: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  viewCount: number;

  @Column({ default: 1 })
  @Field(() => Int)
  personCount: number;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isFull: boolean;

  @Column()
  @Field(() => String)
  dateStart: String;

  @Column()
  @Field(() => String)
  dateEnd: String;

  @Column('simple-array')
  @Field(() => [String])
  transport: string[];

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @JoinColumn()
  @OneToOne(() => Image)
  @Field(() => Image)
  eventImage: Image;

  @Column()
  @Field(() => String)
  eventName: string;

  @Column()
  @Field(() => String)
  eventLocation: string;

  @Column()
  @Field(() => String)
  eventStart: string;

  @Column()
  @Field(() => String)
  eventEnd: string;

  @Column()
  @Field(() => String)
  eventCategory: string;

  @JoinTable()
  @ManyToMany(() => User, (scheduledUsers) => scheduledUsers.confirmedBoards)
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
