import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '../interface/tokenPayload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: process.env.JWT_SECRET_KEY,
      secretOrKey: 'mysecret',
      //토큰 만료 기간을 무시할지? false는 만료된 토큰 자체를 거부한다.
      ignoreExpiration: false,
      //validate함수의 첫 번째 인자로 request 객체 전달 여부를 결정.
      // passReqToCallback: true,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOneById(payload.userId);
  }
}
