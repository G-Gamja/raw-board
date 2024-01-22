import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDTO {
  @IsNumber()
  page: number;

  @IsBoolean()
  @IsOptional()
  isDesc: boolean = false;

  @IsNumber()
  @IsOptional()
  perPage: number = 10;
}
