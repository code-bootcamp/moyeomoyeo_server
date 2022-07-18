import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardAddress } from '../address/entities/Board.address.entity';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { BoardResolver } from './boards.resolver';
import { BoardService } from './boards.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardAddress, Board, User, Image])],
  // controllers: [],
  providers: [BoardResolver, BoardService, ImageService],
})
export class BoardModule {}
