import { CreatePostDto } from './dto/create-post.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { UpdatePostDto } from './dto/update-post.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { UserService } from 'src/user/user.service';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { applyQuery } from 'src/utils/posts';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostsQueryDTO } from './dto/query-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly usersService: UserService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.usersService.findOneByEmail(createPostDto.email);

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

  async findAll() {
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

  async findOneById(id: number) {
    // NOTE 삭제된 유저는 배제, SELECT * FROM Users WHERE deleted_at IS NULL;
    const post = await this.knex.raw(
      `select * from Posts where id = '${id}' AND deleted_at IS NULL`,
    );
    if (post[0].length > 0) {
      return post[0][0];
    }
    throw new BadRequestException('존재하지 않는 게시물입니다.');
  }

  async findPostsByEmail(query: PostsQueryDTO) {
    const user = await this.usersService.findOneByEmail(query.email);

    const joinedPosts = await this.knex.raw(
      `SELECT Users.username, Users.email,Posts.created_at, Posts.title, Posts.content
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
    const posts = await this.findAll();

    const aa = applyQuery(query, posts.data);

    // NOTE localhost:3000/post/page?page=1&isDesc=false
    return aa;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = this.findOneById(id);
    if (post) {
      const response = this.knex.raw(
        `UPDATE Posts SET title = '${updatePostDto.title}', content = '${updatePostDto.content}', updated_at = CURRENT_TIMESTAMP WHERE id = '${id}'`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    }
    throw new BadRequestException('존재하지 않는 게시물입니다.');
  }

  async remove(id: number) {
    try {
      const post: Post = await this.findOneById(id);

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
