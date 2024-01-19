import { CreatePostDto } from './dto/create-post.dto';
import { Injectable } from '@nestjs/common';
// import { UpdatePostDto } from './dto/update-post.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class PostService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(createPostDto: CreatePostDto) {
    const response = await this.knex.raw(
      `INSERT INTO Posts (user_id, title, content) VALUES ('${createPostDto.user_id}', '${createPostDto.title}', '${createPostDto.content}')`,
    );

    if (response[0].affectedRows === 1) {
      return { data: 'SUCCESS' };
    }
  }

  async findAll() {
    const response = await this.knex.raw('select * from Posts');

    return { data: response[0] };
  }

  // currentPage: number = 1(유저가 입력한 페이지);
  // const perPage = 10;
  //const startIndex = (currentPage - 1) * perPage;
  // const endIndex = currentPage * perPage;

  // ceil필요할지도?
  // const paginatedPosts = allPosts.slice(startIndex, endIndex);
  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
