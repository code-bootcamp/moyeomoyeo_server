import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    return this.authService.login({ email, password, context });
  }

  @Mutation(() => String)
  logout(@Context() context: any) {
    return this.authService.logout({ context });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @TargetUser() targetUser: any, //
  ) {
    return this.authService.getAccessToken({ user: targetUser });
  }
}
