import { Module } from '@nestjs/common';
import { EmailResolver } from './email.resolver';
import { EmailService } from './email.service';

@Module({
  imports: [],
  providers: [EmailResolver, EmailService],
})
export class EmailModule {}
