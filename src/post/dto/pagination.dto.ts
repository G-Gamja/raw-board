import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationQueryDTO {
  @IsNumber()
  @Type(() => Number)
  page: number;

  // FIXME 개선필요
  @Transform((value) => {
    return value.value == 'true' ? true : false;
  })
  @IsBoolean()
  // @Type(() => Boolean)
  // @Transform((param) => Boolean(param.value))
  @IsOptional()
  isDesc?: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  perPage: number;
}
