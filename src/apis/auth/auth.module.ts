import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social.google.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social.kakao.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social.naver.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
