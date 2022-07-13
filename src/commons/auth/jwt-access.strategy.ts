import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'loginGuard',
) {
  //로그아웃 처리 필요

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'accessKey',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
