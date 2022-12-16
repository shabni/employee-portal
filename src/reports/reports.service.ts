import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {

  constructor(private prisma: PrismaService) {}

  createUserReport(createReportDto: CreateReportDto) {
     return this.prisma.reports.create({data:{
      report_id: MakeTimedIDUnique(),
      ...createReportDto,
      ...datesForCreate()
    }});
  }

  getUserReport(id: string) {
    return this.prisma.reports.findMany({
      orderBy:[{
        date_updated: 'desc'
      }],
      take: 10,
      where: {
        user_id: id
      }
     });
  }

  // findAll() {
  //   return `This action returns all reports`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} report`;
  // }

  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} report`;
  // }
}
