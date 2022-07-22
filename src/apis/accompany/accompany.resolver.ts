import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { AccompanyService } from './accompany.service';
import { Accompany } from './entities/accompany.entity';

@Resolver()
export class AccompanyResolver {
  constructor(private readonly accompanyService: AccompanyService) {}

  createRequest(
    @Args('boardId') boardId: string,
    @TargetUser() targetUser: any,
  ) {
    return this.accompanyService.createRequest({ boardId, targetUser });
  }

  @Mutation(() => Accompany)
  acceptAccompany(@Args('accompanyId') accompanyId: string) {
    return this.accompanyService.accept({ accompanyId });
  }

  @Mutation(() => Accompany)
  refuseAccompany(@Args('accompanyId') accompanyId: string) {
    return this.accompanyService.refuse({ accompanyId });
  }
}
