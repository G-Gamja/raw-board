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
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOneById(payload.userId);
  }
}
