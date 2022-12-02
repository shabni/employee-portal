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

  @ApiProperty({ required: true })
  joining_date: bigint;

  @ApiProperty()
  nic: string;

  @ApiProperty({ required: false })
  emailOffice: string;

  @ApiProperty({ required: false })
  emailpersonal: string;

  @ApiProperty()
  role_Id: string;
}
