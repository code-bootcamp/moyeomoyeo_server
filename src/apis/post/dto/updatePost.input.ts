import { InputType, PartialType } from '@nestjs/graphql';
import { PostInput } from './post.input';

@InputType()
export class UpdatePostInput extends PartialType(PostInput) {}
