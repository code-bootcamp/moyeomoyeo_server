import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Accompany, ACC_REQ_STATUS } from './entities/accompany.entity';

@Injectable()
export class AccompanyService {
  constructor(
    @InjectRepository(Accompany)
    private readonly accompanyRepository: Repository<Accompany>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRequest({ boardId, targetUser }) {
    const boardFound = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
    });
    //prettier-ignore
    const request = await this.accompanyRepository.save({
      board: boardFound, reqUser: userFound,
    });
    return request;
  }

  async fetchAll() {
    const requests = await this.accompanyRepository.find({
      relations: ['board', 'reqUser'],
    });
    return requests;
  }

  async accept({ accompanyId }) {
    const reqFound = await this.accompanyRepository.findOne({
      where: { id: accompanyId },
    });
    const result = await this.accompanyRepository.save({
      ...reqFound,
      reqStatus: ACC_REQ_STATUS.ACCEPTED,
    });
    // accept 눌리면 최종 동행하는 유저 목록에 추가
    let acceptedUsers = reqFound.board.scheduledUsers;
    if (!acceptedUsers) acceptedUsers = [];

    // 중복 동행 등록 불가능
    for (let i = 0; i < acceptedUsers.length; i++) {
      const user = acceptedUsers[i];
      if (user.id === reqFound.reqUser.id) return acceptedUsers;
    }

    acceptedUsers.push(reqFound.reqUser);
    await this.boardRepository.save({
      ...reqFound.board,
      scheduledUsers: acceptedUsers,
    });
    return result;
  }

  async refuse({ accompanyId }) {
    const reqFound = await this.accompanyRepository.findOne({
      where: { id: accompanyId },
    });
    return await this.accompanyRepository.save({
      ...reqFound,
      reqStatus: ACC_REQ_STATUS.REFUSED,
    });
  }
}
