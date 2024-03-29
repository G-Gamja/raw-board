import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LocalAuthenticationGuard } from './local/localAuth.guard';
import RequestWithUser from './interface/requestWithUser.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  // TODO 바디 데이터 벨리데이션 필요.해킹구문방지..리서치 sql injection
  async register(@Body() registrationData: RegisterAuthDto) {
    return this.authenticationService.register(registrationData);
  }

  // NOTE 가드 미들웨어는 라우트 핸들러가 요청을 처리할지 말지를 판단
  // NOTE 아래의 요청에 passport미들웨어에서 처리하도록한다 (local전략)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  // NOTE 미들웨어 통과 시 아래 로직 실행
  // TODO 미들웨어 통과했다고 user데이터 정보가 어떻게 넘어오는거지?
  // NOTE => passport미들웨어에서 user데이터를 넘겨주는데 이 데이터가 request객체에 담겨서 넘어온다
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    // TODO 갱신전략 고려하기> 추후에
    response.setHeader('Set-Cookie', cookie);
    // res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
    // res.cookie('access_token', access_token, {
    //   httpOnly: true,
    // });
    // res.cookie('refresh_token', refresh_token, {
    //   httpOnly: true,
    // });

    user.password = undefined;
    return response.send({
      data: 'SUCCESS',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.send({
      data: 'SUCCESS',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('withdraw-membership')
  async withdrawMembership(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    await this.authenticationService.withdrawMembership(request.user);

    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.send({
      data: 'SUCCESS',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;

    user.password = undefined;
    return user;
  }
}
