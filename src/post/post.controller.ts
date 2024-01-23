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
import { PaginationQueryDTO } from './dto/pagination';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('post')
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

  // FIXME 패스 라우트가 all,total 맥락이 중첩되어 보임
  @Get('all')
  findAll() {
    return this.postService.findAll();
  }

  @Get('total')
  @UseGuards(JwtAuthGuard)
  getTotalPostsQuantity() {
    return this.postService.getAllPostsQuantity();
  }

  @Get(':email')
  findPostsByEmail(@Param('email') email: string) {
    return this.postService.findPostsByEmail(email);
  }

  @Get('id/:id')
  findPostById(@Param('id') id: number) {
    return this.postService.findOneById(id);
  }

  @Put('id/:id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
