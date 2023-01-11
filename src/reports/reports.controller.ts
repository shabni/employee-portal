import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/reports')
@ApiTags('Reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('createUserReport')
  createUserReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.createUserReport(createReportDto);
  }

  @Get('getUserReport/:id')
  getUserReport(@Param('id') id: string) {
    return this.reportsService.getUserReport(id);
  }

  @Patch('updateReport/:id')
  updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.updateReport(id, updateReportDto);
  }
}
