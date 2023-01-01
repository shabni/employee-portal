import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateAttendenceDto {
  @IsNumber()
  @ApiProperty({ required: true })
  attendenceDate: bigint;

  @IsNumber()
  @ApiProperty({ required: true })
  checkInTime: bigint;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  checkOutTime?: bigint;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}
