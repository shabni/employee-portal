import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  scale: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  permissions: string;
}
