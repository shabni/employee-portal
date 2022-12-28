import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LogInDto,
  logInUserDto,
  logOutUserDto,
  createSessionDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async LogIn(LogInDto: LogInDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        userName: LogInDto.userName,
      },
    });

    if (user.isCheckedIn) {
      let x = await this.findUserAttendenceTime(user.userId);
      user['attendenceDate'] = x['attendenceDate'];
      user['checkInTime'] = x['checkInTime'];
    }

    // if (user.isLoggedIn)
    // {
    //   return user
    // }

    if (
      user.userName === LogInDto.userName &&
      user.password === LogInDto.password
    ) {
      this.updateUser(user.userId, { isLoggedIn: true });
      user.isLoggedIn = true;
      let session = await this.getUserSession(user.userName);

      if (session) {
        session['sessionExist'] = true;
        return session;
      } else {
        user['sessionExist'] = false;
        return user;
      }
    } else throwError;
  }

  async LogOut(logOutUserDto: logOutUserDto) {
    this.updateUser(logOutUserDto.userId, { isLoggedIn: false });

    this.removeSession(logOutUserDto.userName);
  }

  async removeSession(userName: string) {
    const dleted = await this.prisma.session.deleteMany({
      where: {
        userName: userName,
      },
    });
    return dleted;
  }

  async updateUser(id: string, logInUserDto: logInUserDto) {
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: { ...logInUserDto },
    });

    return resp;
  }

  async findUserAttendenceTime(id: string) {
    const attendence = await this.prisma.attendence.findMany({
      where: {
        userId: id,
      },
    });
    return attendence[attendence.length - 1];
  }

  async getUserSession(userName) {
    const session = await this.prisma.session.findFirst({
      where: {
        userName: userName,
      },
    });

    return session;
  }

  findRole(id: string) {
    return this.prisma.roles.findFirst({
      select: { permissions: true },
      where: {
        roleId: id,
      },
    });
  }

  makePermissions(permissions: string) {
    let permissionsList: string[] = permissions.split(',');
    let permissinData = {};
    permissionsList.forEach((element) => {
      permissinData[element] = true;
    });

    return permissinData;
  }

  async getSession() {
    let profile = await this.prisma.session.findMany({
      select: {
        userId: true,
        fName: true,
        lName: true,
        userName: true,
        fatherName: true,
        joiningDate: true,
        isLoggedIn: true,
        roleId: true,
        phone: true,
        emailOffice: true,
        address: true,
        attendenceDate: true,
        checkInTime: true,
        checkOutTime: true,
        profileImage: true,
        designation: true,
      },

      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      take: 1,
    });

    let data = {};

    if (profile.length > 0) {
      data['profile'] = profile[0];
      let permissions = await this.findRole(data['profile']['roleId']);
      if (permissions['permissions'])
        data['permissions'] = this.makePermissions(permissions['permissions']);
    }

    return data;
  }

  async createSession(createSessionDto: createSessionDto) {
    let data = {};

    let session = await this.prisma.session.create({
      data: {
        sessionId: MakeTimedIDUnique(),
        ...createSessionDto,
        ...datesForCreate(),
      },
    });

    data['profile'] = session;
    let permissions = await this.findRole(data['profile']['roleId']);
    if (permissions['permissions'])
      data['permissions'] = this.makePermissions(permissions['permissions']);

    return data;
  }

  async updateSession(userName: string, updateSessionDto: any) {
    const resp = await this.prisma.session.update({
      where: { userName: userName },
      data: { ...updateSessionDto },
    });

    return resp;
  }
}
