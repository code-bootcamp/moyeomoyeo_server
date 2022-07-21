import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  checkFormat({ email }) {
    if (email === undefined || !email.includes('@')) return false;
    return true;
  }

  async sendEmail({ email }) {
    if (!this.checkFormat({ email })) return '이메일 주소를 다시 확인해주세요.';
    const userFound = await this.userRepository.findOne({ where: { email } });
    if (!userFound)
      throw new UnprocessableEntityException(
        'Error 422: 등록된 사용자가 아닙니다. 회원가입을 먼저 진행해주세요',
      );
    // 사용자 비밀번호 재설정 인증번호 생성
    const resetToken = String(Math.floor(Math.random() * 10 ** 6)).padStart(
      6,
      '0',
    );

    const EMAIL_USER = process.env.NODEMAILER_USER;
    const EMAIL_SECRET = process.env.NODEMAILER_SECRET;
    const EMAIL_SENDER = process.env.NODEMAILER_SENDER;

    // 비밀번호 재설정 인증번호 캐시 데이터에 저장: 저장 시간 임의로 10분 설정
    await this.cacheManager.set(email, resetToken, {
      ttl: 600,
    });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_SECRET,
      },
    });

    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: email,
      subject: '[모여모여] 비밀번호 재설정 인증번호가 발급되었습니다',
      text: `비밀번호 재설정을 위하여 인증번호 ${resetToken}를 입력해주세요.`,
    });

    return `${email}로 비밀번호 재설정 이메일을 전송하였습니다.`;
  }

  async authorizeReset({ email, tokenInput }) {
    const resetTokenSent = await this.cacheManager.get(email);
    if (resetTokenSent === tokenInput) {
      await this.userRepository.update({ email }, { isAuth: true });
      return true;
    }
    return false;
  }
}
