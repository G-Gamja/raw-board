import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    // NOTE @nestjs/confing 설정 혹은 dotenv로 설정가능
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '3000s' },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
