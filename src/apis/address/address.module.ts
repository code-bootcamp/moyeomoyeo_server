import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { BoardAddress } from './entities/Board.address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardAddress])],
  providers: [AddressService],
})
export class AddressModule {}
