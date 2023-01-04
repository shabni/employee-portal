import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as dateFns from 'date-fns';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  getTeamMembers(id: string) {
    return this.prisma.users.findMany({
      select: {
        userId: true,
        fName: true,
        lName: true,
        fatherName: true,
        joiningDate: true,
        userName: true,
        password: true,
        nic: true,
        emailOffice: true,
        address: true,
        phone: true,
        roleId: true,
        teamLeadId: true,
        profileImage: true,
        designation: true,
      },
      where: {
        teamLeadId: id,
      },
    });
  }

  makeUserAttendenceData(allUsers, attendence) {
    let attendenceObject = {};

    attendence.forEach((element) => {
      attendenceObject[element.userId] = element;
    });

    allUsers.forEach((element) => {
      if (attendenceObject.hasOwnProperty(element.userId)) {
        element['attendenceDate'] =
          attendenceObject[element.userId]['attendenceDate'];
        element['checkInTime'] =
          attendenceObject[element.userId]['checkInTime'];
        element['checkOutTime'] =
          attendenceObject[element.userId]['checkOutTime'];
      } else {
        element['attendenceDate'] = null;
        element['checkInTime'] = null;
        element['checkOutTime'] = null;
      }
    });

    return allUsers;
  }

  makeStEndDate(attendenceDate) {
    const dateFormat = new Date(attendenceDate * 1000);
    const start = dateFns.startOfDay(dateFormat);
    const end = dateFns.endOfDay(dateFormat);

    return {
      start: Math.floor(start.getTime() / 1000),
      end: Math.floor(end.getTime() / 1000),
    };
  }

  async getTeamAttendence(attendenceDate, userId) {
    const { start, end } = this.makeStEndDate(attendenceDate);

    let userIdList: any[] = [];
    let whereCondition: any[] = [];

    userIdList = await this.prisma.users.findMany({
      select: { userId: true, fName: true, lName: true },
      where: {
        teamLeadId: userId,
      },
    });

    userIdList.forEach((element) => {
      element.userId = element.userId;

      whereCondition.push({
        AND: [
          { userId: element.userId },
          {
            attendenceDate: {
              gt: start,
            },
          },
          {
            attendenceDate: {
              lt: end,
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

  makeUserReportData(allUsers, reports) {
    let reportsObject = {};

    reports.forEach((element) => {
      reportsObject[element.userId] = element;
    });

    allUsers.forEach((element) => {
      if (reportsObject.hasOwnProperty(element.userId)) {
        element['reportDate'] = reportsObject[element.userId]['reportDate'];
        element['description'] = reportsObject[element.userId]['description'];
      } else {
        element['reportDate'] = null;
        element['description'] = null;
      }
    });

    return allUsers;
  }

  async getTeamReports(attendenceDate, userId) {
    const { start, end } = this.makeStEndDate(attendenceDate);

    let userIdList: any[] = [];
    let whereCondition: any[] = [];

    userIdList = await this.prisma.users.findMany({
      select: { userId: true, fName: true, lName: true },
      where: {
        teamLeadId: userId,
      },
    });

    userIdList.forEach((element) => {
      whereCondition.push({
        AND: [
          { userId: element.userId },
          {
            reportDate: {
              gt: start - 1,
            },
          },
          {
            reportDate: {
              lt: end,
            },
          },
        ],
      });
    });

    let reports = await this.prisma.reports.findMany({
      where: {
        OR: whereCondition,
      },
    });

    let allUsers = this.makeUserReportData(userIdList, reports);

    return allUsers;
  }

  async getTeamProgress(progressDate, userId) {
    const { start, end } = this.makeStEndDate(progressDate);

    let userIdList: any[] = [];
    let whereCondition: any[] = [];
    let whereConditionActive: any[] = [];

    userIdList = await this.prisma.users.findMany({
      select: {
        userId: true,
        fName: true,
        lName: true,
      },
      where: { teamLeadId: userId },
    });

    let users = {};

    userIdList.forEach((element) => {
      users[element.userId] = element;

      whereCondition.push({
        AND: [
          { userId: element.userId },
          { startDate: { gt: start } },
          { startDate: { lt: end } },
        ],
      });
    });

    userIdList.forEach((element) => {
      whereConditionActive.push({
        AND: [
          { userId: element.userId },
          { startDate: { gt: start } },
          { startDate: { lt: end } },
          { isActive: true },
        ],
      });
    });

    let progress = await this.prisma.taskTracks.groupBy({
      by: ['taskId', 'userId'],
      where: { OR: whereCondition },
      _sum: { duration: true },
    });

    let activeTasks = await this.prisma.taskTracks.findMany({
      where: {
        OR: whereConditionActive,
      },
    });

    let tasksIds = [];

    // const ret = progress.map((pr) => {
    //   const task = activeTasks.find(
    //     (task) =>
    //       task.isActive &&
    //       pr.taskId === task.taskId &&
    //       pr.userId === task.userId,
    //   );

    //   return {
    //     ...pr,
    //     isActive: task?.isActive,
    //   };
    // });

    // console.log(activeTasks);
    progress.forEach((progress) => {
      activeTasks.forEach((task) => {
        if (
          progress.taskId === task.taskId &&
          progress.userId === task.userId
        ) {
          progress['isActive'] = true;
        }
      });
      progress['duration'] = progress._sum.duration;
      progress['user'] = users[progress.userId];
      tasksIds.push({ taskId: progress.taskId });
      delete progress._sum;
      delete progress.userId;
    });

    let allTasks = await this.prisma.tasks.findMany({
      select: { taskId: true, title: true },
      where: { OR: tasksIds },
    });

    let tasksHash = {};

    allTasks.forEach((element) => {
      tasksHash[element.taskId] = element;
    });

    progress.forEach((element) => {
      element['task'] = tasksHash[element.taskId];
      delete element.taskId;
    });

    // console.log(progress, ret);
    return progress;
  }
}
