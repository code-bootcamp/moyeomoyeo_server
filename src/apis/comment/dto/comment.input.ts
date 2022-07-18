import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentInput {
  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  parentId?: string;
}
