import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
      //scope: ['profile', 'email'],
    });
  }

  async validate(_, __, profile) {
    console.log(profile);
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
      password: profile.id,
    };
  }
}
