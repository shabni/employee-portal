import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  password: string;
}

export class logInUserDto {
  @ApiProperty()
  isLoggedIn: boolean;
}

export class logOutUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;
}

export class createSessionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  fName?: string;

  @ApiProperty()
  lName?: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  fatherName?: string;

  @ApiProperty()
  joiningDate?: bigint;

  @ApiProperty()
  isLoggedIn?: boolean;

  @ApiProperty()
  isCheckedIn?: boolean;

  @ApiProperty()
  roleId?: string;

  @ApiProperty()
  emailOffice?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  phone?: number;

  @ApiProperty()
  updatedAt?: bigint;

  @ApiProperty()
  createdAt?: bigint;

  @ApiProperty()
  isDeleted?: boolean;

  @ApiProperty()
  attendenceDate?: bigint;

  @ApiProperty()
  checkInTime?: bigint;

  @ApiProperty()
  checkOutTime?: bigint;

  @ApiProperty()
  profileImage?: string;

  @ApiProperty()
  designation?: string;
}
