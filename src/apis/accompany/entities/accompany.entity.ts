import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ACC_REQ_STATUS {
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
  PENDING = 'PENDING',
}

registerEnumType(ACC_REQ_STATUS, {
  name: 'ACC_REQ_STATUS',
});

@Entity()
@ObjectType()
export class Accompany {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => Board, (board) => board.accompanyRequests)
  @Field(() => Board)
  board: Board;

  @CreateDateColumn()
  @Field(() => Date)
  reqDate: Date;

  @ManyToOne(() => User, (reqUser) => reqUser.scheduledBoards)
  @Field(() => User)
  reqUser: User;

  @Column({ default: ACC_REQ_STATUS.PENDING })
  @Field(() => ACC_REQ_STATUS, { defaultValue: ACC_REQ_STATUS.PENDING })
  reqStatus: ACC_REQ_STATUS;
}
