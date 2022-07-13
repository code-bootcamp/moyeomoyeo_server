import { Field, InputType } from '@nestjs/graphql';
import { BoardAddressInput } from 'src/apis/address/dto/Board.address.input';
import { Column } from 'typeorm';

@InputType()
export class CreateBoardInput {
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

  @Column({ default: false })
  @Field(() => Boolean)
  isFull: boolean;

  @Column()
  @Field(() => Date)
  targetDate: Date;

  @Column()
  @Field(() => String)
  transport: string;

  @Field(() => BoardAddressInput)
  boardAddress: BoardAddressInput;
}
