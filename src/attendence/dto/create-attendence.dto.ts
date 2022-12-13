import { ApiProperty } from "@nestjs/swagger";

export class CreateAttendenceDto {
    @ApiProperty()
    attendence_date: bigint;

    @ApiProperty()
    check_in_time: bigint;

    @ApiProperty()
    check_out_time: bigint;
  
    @ApiProperty({ required: false })
    user_Id: string;

    @ApiProperty({ required: false })
    userName: string;
  
}
