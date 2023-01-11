import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserIdsDto } from './dto/user-ids.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as dateFns from 'date-fns';
import { WhereCondition } from './dto/where-condition.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  getTeamMembers(id: string) {
    return this.prisma.users.findMany({
      where: {
        teamLeadId: id,
      },
    });
  }

  makeUserAttendenceData(allUsers, attendence) {
    let attendenceHash = {};

    attendence.forEach((element) => {
      attendenceHash[element.userId] = element;
    });

    allUsers.forEach((element) => {
      if (attendenceHash.hasOwnProperty(element.userId)) {
        element.attendenceDate =
          attendenceHash[element.userId]['attendenceDate'];
        element.checkInTime = attendenceHash[element.userId]['checkInTime'];
        element.checkOutTime = attendenceHash[element.userId]['checkOutTime'];
      } else {
        element.attendenceDate = null;
        element.checkInTime = null;
        element.checkOutTime = null;
      }
    });

    return allUsers;
  }

  makeStEndDate(attendenceDate: number) {
    const dateFormat = new Date(attendenceDate * 1000);
    const start = dateFns.startOfDay(dateFormat);
    const end = dateFns.endOfDay(dateFormat);

    return {
      start: Math.floor(start.getTime() / 1000),
      end: Math.floor(end.getTime() / 1000),
    };
  }

  async getTeamAttendence(attendenceDate: number, userId: string) {
    const { start, end } = this.makeStEndDate(attendenceDate);

    let userIdList: UserIdsDto[] = [];
    let whereCondition: WhereCondition[] = [];

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
          { attendenceDate: { gt: start } },
          { attendenceDate: { lt: end } },
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
    let reportsHash = {};

    reports.forEach((element) => {
      reportsHash[element.userId] = element;
    });

    allUsers.forEach((element) => {
      if (reportsHash.hasOwnProperty(element.userId)) {
        element.reportDate = reportsHash[element.userId]['reportDate'];
        element.description = reportsHash[element.userId]['description'];
      } else {
        element.reportDate = null;
        element.description = null;
      }
    });

    return allUsers;
  }

  async getTeamReports(attendenceDate, userId) {
    const { start, end } = this.makeStEndDate(attendenceDate);

    let userIdList: UserIdsDto[] = [];
    let whereCondition: WhereCondition[] = [];

    userIdList = await this.prisma.users.findMany({
      select: { userId: true, fName: true, lName: true },
      where: { teamLeadId: userId },
    });

    userIdList.forEach((element) => {
      whereCondition.push({
        AND: [
          { userId: element.userId },
          { reportDate: { gt: start - 1 } },
          { reportDate: { lt: end } },
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

    let userIdList: UserIdsDto[] = [];
    let whereCondition: WhereCondition[] = [];
    let whereConditionActive: WhereCondition[] = [];

    userIdList = await this.prisma.users.findMany({
      select: { userId: true, fName: true, lName: true },
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

    const projecProgress = progress.map((progress) => {
      const task = activeTasks.find(
        (task) =>
          task.isActive &&
          progress.taskId === task.taskId &&
          progress.userId === task.userId,
      );
      progress['duration'] = progress._sum.duration;
      progress['user'] = users[progress.userId];
      tasksIds.push({ taskId: progress.taskId });
      delete progress._sum;
      delete progress.userId;

      return {
        ...progress,
        isActive: task?.isActive,
      };
    });

    let allTasks = await this.prisma.tasks.findMany({
      select: { taskId: true, title: true },
      where: { OR: tasksIds },
    });

    let tasksHash = {};

    allTasks.forEach((element) => {
      tasksHash[element.taskId] = element;
    });

    projecProgress.forEach((element) => {
      element['task'] = tasksHash[element.taskId];
      delete element.taskId;
    });

    return projecProgress;
  }
}
