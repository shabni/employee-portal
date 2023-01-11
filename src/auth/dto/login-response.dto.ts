import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class LogInResponseDto {
  @IsOptional()
  @ApiProperty({ required: true })
  profile?: CreatedSessionDto;

  @ApiProperty({ required: true })
  permissions?: any;

  @ApiProperty({ required: true })
  session?: boolean;
}

export class CreatedSessionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  fName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  lName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  fatherName?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  joiningDate?: bigint;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isLoggedIn?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isCheckedIn?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  roleId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  emailOffice?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  address?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  phone?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  attendenceDate?: bigint;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  checkInTime?: bigint;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  checkOutTime?: bigint;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  profileImage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  designation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  token?: string;
}
