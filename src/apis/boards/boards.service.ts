import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardAddress } from '../address/entities/Board.address.entity';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(BoardAddress)
    private readonly boardAddress: Repository<BoardAddress>,

    private readonly imageService: ImageService,
  ) {}

  async update({ boardId, updateBoardInput }) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    const newboard = {
      ...board,
      id: boardId,
      ...updateBoardInput,
    };

    return await this.boardRepository.save(newboard);
  }

  async create({ payload, createBoardInput }) {
    const { coverImgSrc, boardAddress, targetDate, ...input } =
      createBoardInput;

    // 유저 찾기
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    // 주소 생성
    const addr = await this.boardAddress.save(boardAddress);

    // 일시 생성
    // const date = await this.boardDateRepository.save(targetDate);

    // 커버 이미지 불러오기
    const coverImage = await this.imageService.create({ src: coverImgSrc });

    // 게시판 생성
    const result = await this.boardRepository.save({
      ...input,
      boardAddress: addr,
      // targetDate: date,
      writer: user,
      coverImage,
    });

    return result;
  }

  async delete({ boardId }) {
    const result = await this.boardRepository.softDelete({ id: boardId });
    return result.affected ? true : false;
  }

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({ where: { id: boardId } });
  }

  async request() {}
}
