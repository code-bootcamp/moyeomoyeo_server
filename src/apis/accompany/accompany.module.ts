import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../boards/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { AccompanyResolver } from './accompany.resolver';
import { AccompanyService } from './accompany.service';
import { Accompany } from './entities/accompany.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accompany, Board, User])],
  providers: [AccompanyResolver, AccompanyService],
})
export class AccompanyModule {}
