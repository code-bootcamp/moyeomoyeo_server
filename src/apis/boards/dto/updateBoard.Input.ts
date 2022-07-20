import { Field, InputType, Int } from '@nestjs/graphql';
import { userInfo } from 'os';
import { UserInput } from 'src/apis/user/dto/user.input';
import { Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@InputType()
export class UpdateBoardInput {
  @Column()
  @Field(() => String)
  writer: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Number)
  viewCount: number;

  @Column({ default: 1 })
  @Field(() => Int)
  personCount: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isFull: boolean;

  @Column()
  @Field(() => String)
  dateStart: Date;

  @Column()
  @Field(() => String)
  dateEnd: Date;

  // @Field(() => String)
  // parentEvent: string;

  @Column()
  @Field(() => [String])
  transport: string[];

  @Column()
  @Field(() => [UserInput])
  scheduledUsers: UserInput[];
}
