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
  fName?: string;

  @ApiProperty({ required: false })
  lName?: string;

  @ApiProperty({ required: false })
  fatherName?: string;

  @ApiProperty({ required: true })
  userName?: string;

  @ApiProperty({ required: true })
  password?: string;

  @ApiProperty({ required: true })
  joiningDate?: bigint;

  @ApiProperty({ required: true })
  phone?: number;

  @ApiProperty({ required: true })
  nic?: string;

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
}
