import { ApiProperty } from '@nestjs/swagger';

export class LogInResponseDto {
  @ApiProperty({ required: true })
  profile?: CreatedSessionDto;

  @ApiProperty({ required: true })
  permissions?: any;

  @ApiProperty({ required: true })
  session?: boolean;
}

export class CreatedSessionDto {
  @ApiProperty({ required: true })
  userId?: string;

  @ApiProperty({ required: false })
  fName?: string;

  @ApiProperty({ required: false })
  lName?: string;

  @ApiProperty({ required: true })
  userName?: string;

  @ApiProperty({ required: true })
  password?: string;

  @ApiProperty({ required: false })
  fatherName?: string;

  @ApiProperty({ required: false })
  joiningDate?: bigint;

  @ApiProperty({ required: false })
  isLoggedIn?: boolean;

  @ApiProperty({ required: false })
  isCheckedIn?: boolean;

  @ApiProperty({ required: false })
  roleId?: string;

  @ApiProperty({ required: false })
  emailOffice?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  phone?: number;

  @ApiProperty({ required: false })
  attendenceDate?: bigint;

  @ApiProperty({ required: false })
  checkInTime?: bigint;

  @ApiProperty({ required: false })
  checkOutTime?: bigint;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({ required: false })
  designation?: string;

  @ApiProperty({ required: false })
  token?: string;
}
