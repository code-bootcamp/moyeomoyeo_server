import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailService } from './email.service';

@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Mutation(() => String)
  sendEmail(@Args('email') email: string) {
    return this.emailService.sendEmail({ email });
  }

  @Mutation(() => Boolean)
  authorizeReset(
    @Args('email') email: string,
    @Args('tokenInput') tokenInput: string,
  ) {
    return this.emailService.authorizeReset({ email, tokenInput });
  }
}
