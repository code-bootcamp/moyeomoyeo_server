import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
