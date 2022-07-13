import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PhoneService } from './phone.service';

@Resolver()
export class PhoneResolver {
  constructor(private readonly phoneService: PhoneService) {}

  @Mutation(() => String)
  sendSMS(@Args('phone') phone: string) {
    return this.phoneService.sendToken({ phone });
  }

  @Mutation(() => Boolean)
  validatePhone(
    @Args('phone') phone: string,
    @Args('tokenInput') tokenInput: string,
  ) {
    return this.phoneService.checkToken({ phone, tokenInput });
  }
}
