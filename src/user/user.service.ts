import { InjectConnection } from 'nest-knexjs';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  // NOTE Auth를 안거치는 접근을 어떻게 방지할까?
  async create(createUserDto: CreateUserDto) {
    try {
      const response = await this.knex.raw(
        `INSERT INTO Users (email, password, username) VALUES ('${createUserDto.email}', '${createUserDto.password}', '${createUserDto.username}')`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }

  // NOTE Deprecated
  async login(loginUserDto: LoginUserDto) {
    try {
      const dupe = await this.findOneByEmail(loginUserDto.email);

      if (dupe[0].length === 0) {
        throw new BadRequestException('존재하지 않는 이메일입니다.');
      }

      if (dupe[0].password !== loginUserDto.password) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }

      return { data: 'SUCCESS' };
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const aa = await this.knex.raw('select * from Users');

    return { data: aa[0] };
  }

  findOne(id: number) {
    const a = this.knex('Users').where({ user_id: id });
    return `This action returns a #${a} user`;
  }

  async findOneById(id: number) {
    const user = await this.knex.raw(`select * from Users where id = '${id}'`);
    if (user[0].length > 0) {
      return user[0];
    }
    throw new BadRequestException('존재하지 않는 유저입니다.');
  }

  async findOneByEmail(email: string) {
    const user = await this.knex.raw(
      `select * from Users where email = '${email}'`,
    );

    if (user[0].length > 0) {
      return user[0];
    }
    return undefined;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
