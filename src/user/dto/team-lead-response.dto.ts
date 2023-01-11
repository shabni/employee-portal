import { ApiProperty } from '@nestjs/swagger';

export class teamLeadResponse {
  @ApiProperty({ required: true })
  fName?: string;

  @ApiProperty({ required: false })
  userId?: string;
}
