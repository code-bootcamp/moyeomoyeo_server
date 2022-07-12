import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginSocial({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginSocial({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginSocial({ req, res });
  }
}
