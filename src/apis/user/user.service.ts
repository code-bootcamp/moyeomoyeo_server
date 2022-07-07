import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUsers() {
    const result = await this.userRepository.find();
    return result;
  }

  async findUser({ email }) {
    const result = await this.userRepository.findOne({ where: { email } });
    return result;
  }

  async create({ userInput }) {
    const { email, password, ...userInfo } = userInput;
    const userFound = await this.userRepository.findOne({ where: { email } });
    if (userFound) throw new ConflictException('이미 등록된 이메일입니다.');
    const hashedPwd = await bcrypt.hash(password, 12);
    const createdUser = await this.userRepository.save({
      ...userInfo,
      email,
      password: hashedPwd,
    });
    return createdUser;
  }

  //로그인 후에만 회원정보 수정 가능
  async update({ targetUser, updateUserInput }) {
    const userFound = await this.findUser({ email: targetUser.email });
    const updatedUser = await this.userRepository.save({
      ...userFound,
      ...updateUserInput,
    });
    return updatedUser;
  }
}
