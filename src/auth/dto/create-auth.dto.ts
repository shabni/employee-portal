import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class LogOutUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}
export class GetSessionDto {
  @ApiProperty({ required: true })
  token: string;
}
