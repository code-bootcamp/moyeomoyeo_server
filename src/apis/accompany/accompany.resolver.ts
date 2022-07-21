import { Args, Resolver } from '@nestjs/graphql';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { AccompanyService } from './accompany.service';

@Resolver()
export class AccompanyResolver {
  constructor(private readonly accompanyService: AccompanyService) {}

  createRequest(
    @Args('boardId') boardId: string,
    @TargetUser() targetUser: any,
  ) {
    return this.accompanyService.createRequest({ boardId, targetUser });
  }
}
