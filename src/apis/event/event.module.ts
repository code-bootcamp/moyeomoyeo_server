import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventResolver, EventService],
})
export class EventModule {}
