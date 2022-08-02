import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  GqlAccessGuard,
  GqlRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const userFound = await this.userService.findUser({ email });
    if (!userFound)
      throw new UnprocessableEntityException('등록되지 않은 사용자입니다.');
    const isAuth = await bcrypt.compare(password, userFound.password);
    if (!isAuth) throw new UnauthorizedException('잘못된 비밀번호입니다.');
    this.authService.setRefreshToken({ userFound, res: context.res });
    const accessToken = this.authService.generateToken({ userFound });
    return accessToken;
  }

  @Mutation(() => String)
  logout(@Context() context: any) {
    return this.authService.logout({ context });
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @TargetUser() targetUser: any, //
  ) {
    return this.authService.getAccessToken({ user: targetUser });
  }
}
