import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class createCheckoutDto {
  @IsNumber()
  @ApiProperty({ required: true })
  attendenceDate: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;

  @IsNumber()
  @ApiProperty({ required: true })
  checkOutTime?: bigint;
}
