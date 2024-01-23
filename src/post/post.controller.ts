import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PostsQueryDTO } from './dto/query-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findPostsByPage(@Query() query: PaginationQueryDTO) {
    return this.postService.findPostsWithPagination(query);
  }

  // NOTE findPostsByPage에 쿼리가 아무것도 안들어갔을때 이거 실행시키도록
  @Get('all')
  findAll() {
    return this.postService.findAll();
  }

  @Get('counts')
  @UseGuards(JwtAuthGuard)
  getTotalPostsQuantity() {
    return this.postService.getAllPostsQuantity();
  }

  @Get('email')
  findPostsByEmail(@Query() query: PostsQueryDTO) {
    return this.postService.findPostsByEmail(query);
  }

  @Get('id/:id')
  findPostById(@Param('id') id: number) {
    return this.postService.findOneById(id);
  }

  @Put('id/:id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete('id/:id')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
