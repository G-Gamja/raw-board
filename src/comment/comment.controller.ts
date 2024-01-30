import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { CommentsQueryDTO } from './dto/query-comments.dts';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(request.user, createCommentDto);
  }

  @Get()
  findCommentsByQuery(@Query() query: CommentsQueryDTO) {
    return this.commentService.findCommentsWithQuery(query);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneById(+id);
  }

  @Put('id/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete('id/:id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
