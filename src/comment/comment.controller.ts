import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  // NOTE 특정 게시물에 달린 댓글들만 가져오기
  // NOTE localhost:3000/comments/posts/8
  @Get('posts/:post_id')
  findCommentsByPostId(@Param('post_id') id: string) {
    return this.commentService.findCommnetsByPostId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
