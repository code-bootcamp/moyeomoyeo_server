import { Module } from '@nestjs/common';
import { PhoneResolver } from './phone.resolver';
import { PhoneService } from './phone.service';
import 'dotenv/config';

@Module({
  providers: [PhoneService, PhoneResolver],
})
export class PhoneModule {}
