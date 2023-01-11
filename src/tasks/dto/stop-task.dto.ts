import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StopTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  taskTrackId: string;
}
