import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  title: string;
}

export class CreateTaskTrackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  taskId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userId: string;
}

export class StopTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  taskTrackId: string;
}
