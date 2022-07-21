import { Field, InputType, Int } from '@nestjs/graphql';
import { BoardAddressInput } from 'src/apis/address/dto/Board.address.input';
import { Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => Int)
  personCount: number;

  @Field(() => String)
  dateStart: Date;

  @Field(() => String)
  dateEnd: Date;

  @Field(() => [String])
  transport: string[];

  @Field(() => BoardAddressInput)
  boardAddress: BoardAddressInput;

  @Field(() => String)
  coverImgSrc: string;
}
