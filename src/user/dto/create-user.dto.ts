import { ApiProperty } from '@nestjs/swagger';
import { IsNotNull } from '@nestjsi/class-validator';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  fName: string;

  @ApiProperty({ required: false })
  lName: string;

  @ApiProperty({ required: false })
  fatherName: string;

  @ApiProperty({ required: false })
  userName: string;

  @ApiProperty({ required: true })
  password: string;

  @IsNumber()
  @ApiProperty({ required: true })
  phone: number;

  @ApiProperty({ required: false })
  joiningDate: bigint;

  @ApiProperty()
  nic: string;

  @ApiProperty({ required: false })
  emailOffice: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({ required: false })
  designation?: string;

  @ApiProperty()
  teamLeadId?: string;
}
