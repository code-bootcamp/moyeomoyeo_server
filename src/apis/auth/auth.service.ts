import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password, context }) {
    const userFound = await this.userService.findUser({ email });
    // 해당 이메일로 가입된 사용자 없다면 오류
    if (!userFound)
      throw new UnprocessableEntityException('등록되지 않은 사용자입니다.');

    // 입력된 비밀번호와 가입시 입력받은 비밀번호 다르다면 오류
    const isAuth = await bcrypt.compare(password, userFound.password);
    if (!isAuth) throw new UnauthorizedException('잘못된 비밀번호입니다.');

    // 다 통과했다면 토큰 발급
    this.setRefreshToken({ userFound, res: context.res });
    const accessToken = this.generateToken({ userFound });

    return accessToken;
  }

  generateToken({ userFound: user }) {
    //수정 가능: email 기준, secret은 새로 발급 후 env 파일로 저장
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'accessKey', expiresIn: '1h' },
    );
    return accessToken;
  }

  setRefreshToken({ userFound: user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'refreshKey', expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }
}
