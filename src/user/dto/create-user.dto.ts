import { ApiProperty } from "@nestjs/swagger";
import { IsNotNull } from "@nestjsi/class-validator";
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
  joining_date: bigint;

  @ApiProperty()
  nic: string;

  @ApiProperty({ required: false })
  emailOffice: string;

  @ApiProperty()
  role_id: string;

  @ApiProperty()
  team_lead_id: string;
}
