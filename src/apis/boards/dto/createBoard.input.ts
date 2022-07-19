import { Field, InputType, Int } from '@nestjs/graphql';
import { BoardAddressInput } from 'src/apis/address/dto/Board.address.input';
import { Event } from 'src/apis/event/entities/event.entity';
import { Column, ManyToOne } from 'typeorm';

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

  @Column({ default: 1 })
  @Field(() => Int)
  personMax: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isFull: boolean;

  @Column()
  @Field(() => String)
  dateStart: Date;

  @Column()
  @Field(() => String)
  dateEnd: Date;

  @Column()
  @Field(() => [String])
  transport: string[];

  @Field(() => BoardAddressInput)
  boardAddress: BoardAddressInput;

  @Field(() => String)
  coverImgSrc: string;

  @Field(() => String)
  parentEvent: string;
}
