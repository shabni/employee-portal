import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as dateFns from 'date-fns';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  getTeamMembers(id: string) {
    return this.prisma.user.findMany({
      select: {
        user_id: true,
        fName: true,
        lName: true,
        fatherName: true,
        joining_date: true,
        userName: true,
        password: true,
        nic: true,
        emailOffice: true,
        address: true,
        phone: true,
        role_id: true,
        team_lead_id: true,
        profile_image: true,
        designation: true,
      },
      where: {
        team_lead_id: id,
      },
    });
  }

  makeUserAttendenceData(allUsers, attendence) {
    let attendenceObject = {};

    attendence.forEach((element) => {
      attendenceObject[element.user_Id] = element;
    });

    allUsers.forEach((element) => {
      if (attendenceObject.hasOwnProperty(element.user_id)) {
        element['attendence_date'] =
          attendenceObject[element.user_id]['attendence_date'];
        element['check_in_time'] =
          attendenceObject[element.user_id]['check_in_time'];
        element['check_out_time'] =
          attendenceObject[element.user_id]['check_out_time'];
      } else {
        element['attendence_date'] = null;
        element['check_in_time'] = null;
        element['check_out_time'] = null;
      }
    });

    return allUsers;
  }

  makeStEndDate(attendenceDate) {
    const dateFormat = new Date(attendenceDate / 1000);
    const start = dateFns.startOfDay(dateFormat);
    const end = dateFns.endOfDay(dateFormat);

    return { start, end };
  }

  async getTeamAttendence(attendenceDate, userId) {
    const { start, end } = this.makeStEndDate(attendenceDate);

    let userIdList: any[] = [];
    let whereCondition: any[] = [];

    userIdList = await this.prisma.user.findMany({
      select: { user_id: true, fName: true, lName: true },
      where: {
        team_lead_id: userId,
      },
    });

    userIdList.forEach((element) => {
      element.user_Id = element.user_id;

      whereCondition.push({
        AND: [
          { user_Id: element.user_id },
          {
            attendence_date: {
              gt: start.getTime(),
            },
          },
          {
            attendence_date: {
              lt: end.getTime(),
            },
          },
        ],
      });
    });

    let attendence = await this.prisma.attendence.findMany({
      where: {
        OR: whereCondition,
      },
    });

    let allUsers = this.makeUserAttendenceData(userIdList, attendence);

    return allUsers;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }
}
