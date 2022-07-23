import { Field, InputType, Int } from '@nestjs/graphql';
import { BoardAddressInput } from 'src/apis/address/dto/Board.address.input';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  remark: string;

  @Field(() => String)
  contents: string;

  @Field(() => Int)
  personCount: number;

  @Field(() => String)
  dateStart: string;

  @Field(() => String)
  dateEnd: string;

  @Field(() => [String])
  transport: string[];

  @Field(() => BoardAddressInput)
  boardAddress: BoardAddressInput;

  @Field(() => String)
  coverImgSrc: string;

  @Field(() => String)
  eventImageSrc: string;

  @Field(() => String)
  eventName: string;

  @Field(() => String)
  eventLocation: string;

  @Field(() => String)
  eventStart: string;

  @Field(() => String)
  eventEnd: string;

  @Field(() => String)
  eventCategory: string;
}
