import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EmailResolver } from './email.resolver';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EmailResolver, EmailService],
})
export class EmailModule {}
