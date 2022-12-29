import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fatherName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @IsNumber()
  @ApiProperty({ required: true })
  joiningDate: bigint;

  @IsNumber()
  @ApiProperty({ required: true })
  phone: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nic: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  emailOffice: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  roleId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address: string;

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
  teamLeadId?: string;
}
