import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { TokenPayload } from './interface/tokenPayload.interface';
import { UserService } from 'src/user/user.service';

// NOTE 이 데코레이터를 선언해야 주입이 가능하다.
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterAuthDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      const dupe = await this.usersService.findOneByEmail(
        registrationData.email,
      );

      if (dupe) {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }

      const createdUser = await this.usersService.create({
        username: registrationData.username,
        email: registrationData.email,
        password: hashedPassword,
      });

      createdUser.password = undefined;

      // return createdUser;
      return {
        data: 'SUCCESS',
      };
    } catch (error) {
      return error;
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      await this.verifyPassword(plainTextPassword, user.password);

      user.password = undefined;

      return user;
    } catch (error) {
      throw new HttpException(
        '잘못된 인증 정보입니다.(에러발생!)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        '잘못된 인증 정보입니다(패스워드).',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    // FIXME 로컬 환경에서 인증이 안되는 거면 앞에 Bearer를 붙여줘야 할 수 있음
    // return `Authentication=Bearer ${token}; HttpOnly; Path=/; Max-Age=300s`;
    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=3000s`;
  }

  public getCookieForLogOut() {
    return `Authorization=; HttpOnly; Path=/; Max-Age=0`;
  }
}
