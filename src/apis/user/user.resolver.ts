import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserInput } from './dto/user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.userService.findUser({ email });
  }

  @Query(() => [User])
  fetchUsers() {
    return this.userService.findUsers();
  }

  @Mutation(() => User)
  createUser(@Args('userInput') userInput: UserInput) {
    return this.userService.create({ userInput });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => User)
  updateUser(
    @TargetUser('targetUser') targetUser: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update({ targetUser, updateUserInput });
  }
}
