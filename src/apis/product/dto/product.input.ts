import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  contentSrc: string;

  @Field(() => String)
  imgSrc: string;

  // 추가이미지
}
