import { Field, InputType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class PostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  address: string;

  @Field(() => Date)
  dateStart: Date;

  @Field(() => Date)
  dateEnd: Date;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  imgSrcs: string[];

  @Field(() => String)
  category: string;
}
