import { ApiProperty } from "@nestjs/swagger";

export class createCheckoutDto {
    @ApiProperty()
    attendence_date: bigint;
  
    @ApiProperty({ required: false })
    user_Id: string;

    @ApiProperty({ required: false })
    userName: string;

    @ApiProperty()
    check_out_time: bigint;
  
}
