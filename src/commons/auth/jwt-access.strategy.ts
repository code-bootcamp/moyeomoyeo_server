import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'loginGuard',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'accessKey',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const tokenFound = await this.cacheManager.get(
      `accessToken=${accessToken}`,
    );
    if (tokenFound)
      throw new UnauthorizedException(
        'Error 401: 로그아웃된 유저입니다. 다시 로그인해주세요.',
      );

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
