import { CreatePostDto } from './dto/create-post.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(user: User, createPostDto: CreatePostDto) {
    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const response = await this.knex.raw(
      `INSERT INTO Posts (user_id, title, content) VALUES ('${user.id}', '${createPostDto.title}', '${createPostDto.content}')`,
    );

    if (response[0].affectedRows === 1) {
      return { data: 'SUCCESS' };
    }
  }

  async findAll(): Promise<{ data: Post[] }> {
    const response = await this.knex.raw(
      'SELECT * from Posts WHERE deleted_at IS NULL',
    );

    return { data: response[0] };
  }

  async getAllPostsQuantity() {
    const response = await this.knex.raw(
      'SELECT * from Posts WHERE deleted_at IS NULL',
    );

    return { data: response[0].length };
  }

  async findOneById(id: number): Promise<Post> {
    const post = await this.knex.raw(
      `SELECT * from Posts WHERE id = '${id}' AND deleted_at IS NULL`,
    );

    if (post[0].length > 0) {
      return post[0][0];
    }
    throw new BadRequestException('존재하지 않는 게시물입니다.');
  }

  async findPostsByEmail(user: User) {
    const joinedPosts = await this.knex.raw(
      `SELECT Users.username, Users.email,Posts.created_at, Posts.title, Posts.content, Posts.id, Posts.updated_at
      FROM Users
      JOIN Posts ON Users.id = Posts.user_id
      WHERE Users.id = '${user.id} AND Posts.deleted_at IS NULL'
      `,
    );
    return {
      data: joinedPosts[0],
    };
  }

  async findPostsWithPagination(query: PaginationQueryDTO) {
    const { page, isDesc, perPage = 10 } = query;

    const joinedPosts = await this.knex.raw(
      `SELECT Posts.*, Users.username, Users.email
      FROM Posts
      LEFT JOIN Users ON Posts.user_id = Users.id
      WHERE Posts.deleted_at IS NULL
      ORDER BY
        COALESCE(Posts.updated_at, Posts.created_at) 
        ${isDesc ? 'DESC' : 'ASC'}
        LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`,
    );
    return {
      data: joinedPosts[0],
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOneById(id);

      if (!post) {
        throw new BadRequestException('존재하지 않는 게시물입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Posts SET title = '${updatePostDto.title}', content = '${updatePostDto.content}', updated_at = CURRENT_TIMESTAMP WHERE id = '${id}'`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      const post = await this.findOneById(id);

      if (!post) {
        throw new BadRequestException('존재하지 않는 게시물입니다.');
      }

      if (post.is_active === 0 || !!post.deleted_at) {
        throw new BadRequestException('이미 삭제된 게시물입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Posts SET deleted_at = CURRENT_TIMESTAMP, is_active = 0 WHERE id = '${post.id}'`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }
}
