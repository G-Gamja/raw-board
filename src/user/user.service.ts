import { InjectConnection } from 'nest-knexjs';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { LoginUserDto } from './dto/login-user.dto';
// import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const dupe = await this.findOneByEmail(createUserDto.email);

      if (dupe[0].length > 0) {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }

      const aa = await this.knex.raw(
        `INSERT INTO Users (email, password, username) VALUES ('${createUserDto.email}', '${createUserDto.password}', '${createUserDto.username}')`,
      );

      if (aa[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const dupe = await this.findOneByEmail(loginUserDto.email);

      console.log('🚀 ~ UserService ~ login ~ dupe:', dupe);

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

  async findOneByEmail(email: string) {
    const user = await this.knex.raw(
      `select * from Users where email = '${email}'`,
    );

    return user[0];
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
