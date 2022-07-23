import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    const result = await this.userRepository.find({
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });
    return result;
  }

  async findUser({ email }) {
    const result = await this.userRepository.findOne({
      where: { email },
      relations: ['scheduledBoards', 'dibsProducts', 'dibsPosts'],
    });
    return result;
  }

  async findLoginUser({ targetUser }) {
    const userFound = await this.userRepository.findOne({
      where: { email: targetUser.email },
      relations: [
        'scheduledBoards',
        'dibsProducts',
        'dibsPosts',
        'dibsProducts.images',
        'dibsPosts.images',
      ],
    });
    return userFound;
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

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }

  async update({ targetUser, updateUserInput }) {
    const userFound = await this.findUser({ email: targetUser.email });
    const updatedUser = await this.userRepository.save({
      ...userFound,
      ...updateUserInput,
    });
    return updatedUser;
  }

  // 비밀번호 재설정 버튼별로 기능 분리: sendEmail, authorizeReset, resetPassword
  async resetPassword({ email, newPassword }) {
    const userFound = await this.userRepository.findOne({ where: { email } });
    if (!userFound.isAuth)
      throw new UnauthorizedException('Error 401: 인증을 다시 시도해주세요.');
    const hashedNew = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update({ email }, { password: hashedNew });
    await this.userRepository.update({ email }, { isAuth: false });
    return true;
  }
}
