import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  institution: string;

  @Field(() => String, { nullable: true })
  manager: string;
}
