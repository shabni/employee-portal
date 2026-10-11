import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class ResponseUserDto {
  @ApiProperty({ required: true })
  userId?: string;

  @ApiProperty({ required: true })
  fName?: string;

  @ApiProperty({ required: false })
  lName?: string;

  @ApiProperty({ required: false })
  fatherName?: string;

  @ApiProperty({ required: true })
  userName?: string;

  @ApiProperty({ required: true })
  joiningDate?: bigint;

  @ApiProperty({ required: false })
  nic?: string;

  @ApiProperty({ required: true })
  phone?: number;

  @ApiProperty({ required: false })
  emailOffice?: string;

  @ApiProperty({ required: false })
  roleId?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({ required: false })
  designation?: string;

  @ApiProperty({ required: false })
  teamLeadId?: string;

  @ApiProperty({ required: false })
  isLoggedIn?: boolean;

  @ApiProperty({ required: false })
  isCheckedIn?: boolean;
}
