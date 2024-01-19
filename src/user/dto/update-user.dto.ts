import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

// NOTE later
export class UpdateUserDto extends PartialType(CreateUserDto) {}
