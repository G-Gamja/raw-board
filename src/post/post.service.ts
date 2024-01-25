import { CreatePostDto } from './dto/create-post.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { UpdatePostDto } from './dto/update-post.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { UserService } from 'src/user/user.service';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly usersService: UserService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

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
      'select * from Posts where deleted_at IS NULL',
    );

    return { data: response[0] };
  }

  async getAllPostsQuantity() {
    const response = await this.knex.raw(
      'select * from Posts where deleted_at IS NULL',
    );

    return { data: response[0].length };
  }

  async findOneById(id: number): Promise<Post> {
    const post = await this.knex.raw(
      `select * from Posts where id = '${id}' AND deleted_at IS NULL`,
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
    const { page, isDesc = true, perPage = 10 } = query;
    // TODO 쿼리문으로 페이징 구현하기
    const posts = await this.findAll();

    const sortedPosts = posts.data.sort((a, b) => {
      const aDate = a.updated_at ? a.updated_at : a.created_at;
      const bDate = b.updated_at ? b.updated_at : b.created_at;
      return isDesc
        ? bDate.getTime() - aDate.getTime()
        : aDate.getTime() - bDate.getTime();
    });

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return paginatedPosts;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.findOneById(id);

      if (!post) {
        throw new BadRequestException('존재하지 않는 게시물입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Posts SET title = '${updatePostDto.title}', content = '${updatePostDto.content}', updated_at = CURRENT_TIMESTAMP where id = '${id}'`,
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
