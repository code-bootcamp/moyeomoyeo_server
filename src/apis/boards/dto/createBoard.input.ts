import { Field, InputType, Int } from '@nestjs/graphql';
import { BoardAddressInput } from 'src/apis/address/dto/Board.address.input';
import { Column } from 'typeorm';
import { BoardDateInput } from '../../date/dto/boardDate.input';

@InputType()
export class CreateBoardInput {
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
  @Field(() => BoardDateInput)
  targetDate: BoardDateInput;

  @Column()
  @Field(() => [String])
  transport: string[];

  @Field(() => BoardAddressInput)
  boardAddress: BoardAddressInput;
}
