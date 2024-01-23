import { IsString } from 'class-validator';

export class PostsQueryDTO {
  @IsString()
  email: string;
}
