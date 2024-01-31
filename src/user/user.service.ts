import { InjectConnection } from 'nest-knexjs';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  // NOTE Auth를 안거치는 접근을 어떻게 방지할까?
  async create(createUserDto: CreateUserDto) {
    try {
      // TODO 이미 삭제된 유저의 이메일은 중복 추가가 안되는 이슈가 있음.
      // TODO UNIQUE INDEX가 걸려 있어서 그런 것 같음.
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

  async findAll() {
    const response = await this.knex.raw('select * from Users');

    return { data: response[0] };
  }

  async findOneById(id: number) {
    // NOTE 삭제된 유저는 배제, SELECT * FROM Users WHERE deleted_at IS NULL;
    const user = await this.knex.raw(
      `select * from Users where id = '${id}' AND deleted_at IS NULL`,
    );
    if (user[0].length > 0) {
      return user[0];
    }
    throw new BadRequestException('존재하지 않는 유저입니다.');
  }

  async findOneByEmail(email: string) {
    const user = await this.knex.raw(
      `select * from Users where email = '${email}' AND deleted_at IS NULL`,
    );

    if (user[0].length > 0) {
      return user[0][0] as User;
    }
    return null;
  }

  // NOTE later
  // NOTE 플래그까지 고려 필요
  async remove(email: string) {
    try {
      const user: User = await this.findOneByEmail(email);

      if (user.is_active === 0) {
        throw new BadRequestException('이미 탈퇴한 유저입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Users SET deleted_at = CURRENT_TIMESTAMP, is_active = 0 WHERE id = '${user.id}'`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }
}
