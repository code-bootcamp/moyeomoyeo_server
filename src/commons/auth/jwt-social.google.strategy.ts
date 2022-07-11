import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '573058645915-s0089us2sts2n484bi6lo1gf1tr7gpfq.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['profile', 'email'],
    });
  }

  async validate(_, __, profile) {
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      password: profile.id,
    };
  }
}
