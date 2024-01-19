import { IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
