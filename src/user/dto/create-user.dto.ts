import { ApiProperty } from "@nestjs/swagger";

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

  @ApiProperty({ required: false })
  boss1: string;
  @ApiProperty({ required: false })
  boss2: string;
  @ApiProperty({ required: false })
  boss3: string;

  @ApiProperty({ required: false })
  joining_date: bigint;

  @ApiProperty()
  nic: string;

  @ApiProperty({ required: false })
  emailOffice: string;

  @ApiProperty()
  role_id: string;
}
