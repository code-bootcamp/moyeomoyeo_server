import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshGuard',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: 'refreshKey',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const tokenFound = this.cacheManager.get(`refreshToken=${refreshToken}`);
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
