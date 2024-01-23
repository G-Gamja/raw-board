import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
