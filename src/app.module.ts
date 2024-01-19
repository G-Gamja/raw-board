import { AuthenticationModule } from './auth/auth.mudule';
import { CommentModule } from './comment/comment.module';
import { KnexModule } from 'nest-knexjs';
import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: '127.0.0.1',
          user: 'root',
          port: 3306,
          password: '0000',
          database: 'board_db',
        },
      },
    }),
    UserModule,
    CommentModule,
    AuthenticationModule,
    PostModule,
  ],
})
export class AppModule {}
