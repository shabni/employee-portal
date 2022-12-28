import { ApiProperty } from '@nestjs/swagger';

export class createCheckoutDto {
  @ApiProperty()
  attendenceDate: bigint;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty({ required: false })
  userName: string;

  @ApiProperty()
  checkOutTime: bigint;
}
