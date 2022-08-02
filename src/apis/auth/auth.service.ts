import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async login({ email, password, context }) {
    const userFound = await this.userService.findUser({ email });
    // 해당 이메일로 가입된 사용자 없다면 오류
    if (!userFound)
      throw new UnprocessableEntityException(
        'Error 422: 등록되지 않은 사용자입니다.',
      );

    // 입력된 비밀번호와 가입시 입력받은 비밀번호 다르다면 오류
    const isAuth = await bcrypt.compare(password, userFound.password);
    if (!isAuth)
      throw new UnauthorizedException('Error 402: 잘못된 비밀번호입니다.');

    // 다 통과했다면 토큰 발급
    this.setRefreshToken({ userFound, res: context.res });
    const accessToken = this.generateToken({ userFound });

    return accessToken;
  }

  async loginSocial({ req, res }) {
    let userFound = await this.userService.findUser({ email: req.user.email });
    if (!userFound) {
      userFound = await this.userService.create({
        userInput: {
          email: req.user.email,
          name: req.user.name,
          password: req.user.password,
        },
      });
    }
    await this.setRefreshToken({ userFound, res });
    res.redirect('http://localhost:3000/graphql');
    return await this.generateToken({ userFound });
  }

  async logout({ context }) {
    const accessToken = context.res.req.headers.authorization.split(' ')[1];
    const refreshToken = context.req.cookies.refreshToken;

    const accessExp = this.checkAccess({ accessToken });
    const refreshExp = this.checkRefresh({ refreshToken });

    await this.cacheManager.set(`accessToken: ${accessToken}`, accessToken, {
      ttl: accessExp,
    });
    await this.cacheManager.set(`refreshToken: ${refreshToken}`, refreshToken, {
      ttl: refreshExp,
    });
    return '로그아웃에 성공하였습니다';
  }

  checkAccess({ accessToken }) {
    try {
      const decoded: any = jwt.verify(accessToken, 'accessKey');
      return decoded.exp;
    } catch (error) {
      throw new UnauthorizedException('Error 401: Invalid Access Token Value');
    }
  }

  checkRefresh({ refreshToken }) {
    try {
      const decoded: any = jwt.verify(refreshToken, 'refreshKey');
      return decoded.exp;
    } catch (error) {
      throw new UnauthorizedException('Error 401: Invalid Refresh Token Value');
    }
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
    try {
      const refreshToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { secret: 'refreshKey', expiresIn: '2w' },
      );
      // 배포환경
      // res.setHeader(
      //   'Access-Control-Allow-Origin',
      //   'http://localhost:3000/graphql',
      // );
      // res.setHeader(
      //   'Set-Cookie',
      //   `refreshToken=${refreshToken}; path=/; SameSite=None; Secure; httpOnly;`,
      // );

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,OPTIONS,POST,PUT',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        domain: '.여기에 우리 백엔드 배포 주소', //ex) domain: '.shaki-server.shop',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return true;
    } catch {
      return false;
    }
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, id: user.id },
      { secret: 'accessKey', expiresIn: '1h' },
    );
  }
}
