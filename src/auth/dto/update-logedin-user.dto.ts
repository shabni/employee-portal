import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatelogedInUserDto {
  @ApiProperty()
  isLoggedIn: boolean;
}

export class logOutUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}
