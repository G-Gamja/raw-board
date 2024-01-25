import { CreateCommentDto } from './dto/create-comment.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { PostService } from 'src/post/post.service';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly postsService: PostService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto) {
    const post = await this.postsService.findOneById(createCommentDto.post_id);

    if (!post) {
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저입니다.');
    }

    const response = await this.knex.raw(
      `INSERT INTO Comments (user_id, post_id, content) VALUES ('${user.id}', '${post.id}', '${createCommentDto.content}')`,
    );

    if (response[0].affectedRows === 1) {
      return { data: 'SUCCESS' };
    }
  }

  async findAll() {
    const joinedPosts = await this.knex.raw(
      `SELECT Comments.id, Comments.content AS commment_content, Comments.created_at, Comments.updated_at, Comments.deleted_at, Posts.title,Posts.content AS post_content ,Users.email,Posts.id AS post_id
      FROM Comments
      JOIN Posts ON Comments.post_id = Posts.id
      JOIN Users ON Comments.user_id = Users.id
      WHERE Comments.deleted_at IS NULL
      `,
    );
    return {
      data: joinedPosts[0],
    };
  }

  // NOTE 한 도메인으로 프론트,api 구현 (api 서비스 홈페이지처럼), 프론트는 넥스트 !!같은 도메인, 다른 레포로 구성, 프록시 서버로 엔진엑스 사용(옵션)
  // 도시 익스텐션 디버깅(wallets add할 수 있게 인터페이스 맞추기), api 서비스 로컬에서 구현해보기.

  async findCommnetsByPostId(id: number) {
    const joinedComments = await this.knex.raw(
      `SELECT Comments.id, Comments.content AS commment_content, Comments.created_at, Comments.updated_at, Comments.deleted_at, Posts.title,Posts.content AS post_content ,Users.email, Users.username,Posts.id AS post_id
      FROM Comments
      JOIN Posts ON Comments.post_id = Posts.id
      JOIN Users ON Comments.user_id = Users.id
      WHERE Posts.id = '${id}' AND Comments.deleted_at IS NULL
      `,
    );
    return {
      data: joinedComments[0],
    };
  }

  async findOneById(id: number): Promise<Comment> {
    const comment = await this.knex.raw(
      `select * from Comments where id = '${id}' AND deleted_at IS NULL`,
    );

    if (comment[0].length > 0) {
      return comment[0][0];
    }
    throw new BadRequestException('존재하지 않는 댓글입니다.');
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.findOneById(id);

      if (!comment) {
        throw new BadRequestException('존재하지 않는 댓글입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Comments SET content = '${updateCommentDto.content}',  updated_at = CURRENT_TIMESTAMP where id = '${id}'`,
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
      const comment = await this.findOneById(id);

      if (!comment) {
        throw new BadRequestException('존재하지 않는 댓글입니다.');
      }

      if (comment.is_active === 0 || !!comment.deleted_at) {
        throw new BadRequestException('이미 삭제된 댓글입니다.');
      }

      const response = await this.knex.raw(
        `UPDATE Comments SET deleted_at = CURRENT_TIMESTAMP, is_active = 0 WHERE id = '${comment.id}'`,
      );

      if (response[0].affectedRows === 1) {
        return { data: 'SUCCESS' };
      }
    } catch (error) {
      return error;
    }
  }
}
