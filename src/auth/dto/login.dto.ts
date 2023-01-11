import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;
}

export class logOutUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}
