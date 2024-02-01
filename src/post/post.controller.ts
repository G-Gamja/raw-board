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
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(request.user, createPostDto);
  }

  @Get()
  findPostsByPage(@Query() query: PaginationQueryDTO) {
    return this.postService.findPostsWithPagination(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findOwnedPostsByUser(@Req() request: RequestWithUser) {
    return this.postService.findPostsByUser(request.user);
  }

  @Get('id/:id')
  findPostById(@Param('id') id: number) {
    return this.postService.findOneById(id);
  }

  @Put('id/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() request: RequestWithUser,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(request.user, id, updatePostDto);
  }

  @Delete('id/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() request: RequestWithUser, @Param('id') id: number) {
    return this.postService.remove(request.user, id);
  }
}
