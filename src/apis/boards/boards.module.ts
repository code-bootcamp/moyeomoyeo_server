import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardAddress } from '../address/entities/Board.address.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { BoardResolver } from './boards.resolver';
import { BoardService } from './boards.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardAddress, Board, User])],
  // controllers: [],
  providers: [BoardResolver, BoardService],
})
export class BoardModule {}
