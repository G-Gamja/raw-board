import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CommentsQueryDTO {
  @IsNumber()
  @Type(() => Number)
  post_id: number;

  // FIXME 개선필요
  @Transform((value) => {
    return value.value == 'true' ? true : false;
  })
  @IsBoolean()
  // @Type(() => Boolean)
  // @Transform((param) => Boolean(param.value))
  @IsOptional()
  isDesc?: boolean;
}
