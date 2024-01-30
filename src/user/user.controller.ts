import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Req() request: RequestWithUser) {
    return this.userService.findOneById(+request.user.id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  // NOTE later
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }

  // NOTE later
  // @put(':id')
  // update(@Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id);
  // }
}
