import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { createCheckoutDto } from './dto/checkout-attendence.dto';

@Controller('attendence')
@ApiTags('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post('/chechIn')
  create(@Body() createAttendenceDto: CreateAttendenceDto) {
    return this.attendenceService.create(createAttendenceDto);
  }

  @Post('/chechOut')
  createOut(@Body() createCheckoutDto: createCheckoutDto) {
    return this.attendenceService.createOut(createCheckoutDto);
  }

  @Get()
  findAll() {
    return this.attendenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendenceDto: UpdateAttendenceDto) {
    return this.attendenceService.update(id, updateAttendenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendenceService.remove(+id);
  }
}
