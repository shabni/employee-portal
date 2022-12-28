import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  createUserReport(createReportDto: CreateReportDto) {
    return this.prisma.reports.create({
      data: {
        reportId: MakeTimedIDUnique(),
        ...createReportDto,
        ...datesForCreate(),
      },
    });
  }

  getUserReport(id: string) {
    return this.prisma.reports.findMany({
      select: {
        description: true,
        userId: true,
        reportDate: true,
        reportId: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      take: 10,
      where: {
        userId: id,
      },
    });
  }

  // findAll() {
  //   return `This action returns all reports`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} report`;
  // }

  async updateReport(id: string, updateReportDto: UpdateReportDto) {
    const resp = await this.prisma.reports.update({
      where: { reportId: id },
      data: { ...updateReportDto },
    });

    return resp;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} report`;
  // }
}
