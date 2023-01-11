import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { createCheckoutDto } from './dto/checkout-attendence.dto';

@Controller('api/attendence')
@ApiTags('Attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post('checkIn')
  checkIn(@Body() createAttendenceDto: CreateAttendenceDto) {
    return this.attendenceService.checkIn(createAttendenceDto);
  }

  @Post('checkOut')
  createOut(@Body() createCheckoutDto: createCheckoutDto) {
    return this.attendenceService.createOut(createCheckoutDto);
  }

  @Get('getUserAttendence/:id')
  getUserAttendence(@Param('id') id: string) {
    return this.attendenceService.getUserAttendence(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendenceDto: UpdateAttendenceDto,
  ) {
    return this.attendenceService.update(id, updateAttendenceDto);
  }
}
