import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import jwt_decode from 'jwt-decode';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LogInDto,
  logInUserDto,
  logOutUserDto,
  createSessionDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async LogIn(LogInDto: LogInDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        userName: LogInDto.userName,
      },
    });

    if (user) {
      if (user?.isCheckedIn) {
        let x = await this.findUserAttendenceTime(user.userId);
        user['attendenceDate'] = x['attendenceDate'];
        user['checkInTime'] = x['checkInTime'];
      }

      // if (user.isLoggedIn)
      // {
      //   return user
      // }

      if (
        user?.userName === LogInDto.userName &&
        user?.password === LogInDto.password
      ) {
        const token = await this.logInToken(user.userId, user.userName);
        this.updateUser(user.userId, { isLoggedIn: true });
        user.isLoggedIn = true;
        let session = await this.getUserSession(user.userId);

        if (session) {
          let data = {};
          data['profile'] = session;
          data['permissions'] = await this.findRole(session.roleId);
          session['token'] = token;
          data['sessionExist'] = true;

          return data;
        } else {
          user['token'] = token;
          user['sessionExist'] = false;
          return user;
        }
      } else
        throw new UnauthorizedException(
          'User name and password does not match!',
        );
    } else throw new UnauthorizedException('User does not exist!');
  }

  async LogOut(logOutUserDto: logOutUserDto) {
    this.updateUser(logOutUserDto.userId, { isLoggedIn: false });

    this.removeSession(logOutUserDto.userId);
  }

  async removeSession(userId: string) {
    const dleted = await this.prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });
    return dleted;
  }

  async updateUser(id: string, logInUserDto: logInUserDto) {
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: { ...logInUserDto, updatedAt: unixTimestamp() },
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

  async getUserSession(userId) {
    const session = await this.prisma.session.findFirst({
      where: {
        userId,
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

  async getSession(token) {
    let data = {};

    if (token.token) {
      var decoded = jwt_decode(token.token);

      let profile = await this.prisma.session.findFirst({
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
        where: {
          userId: decoded['userId'],
        },
      });

      if (profile) {
        data['session'] = true;
        data['profile'] = profile;
        let permissions = await this.findRole(data['profile']['roleId']);
        if (permissions['permissions'])
          data['permissions'] = this.makePermissions(
            permissions['permissions'],
          );
      }
    } else {
      data['session'] = false;
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
      data: { ...updateSessionDto, updatedAt: unixTimestamp() },
    });

    return resp;
  }

  async logInToken(userId: string, userName: string): Promise<string> {
    const seceret = 'super-secret';
    const payload = {
      userId,
      userName,
    };

    return this.jwt.signAsync(payload, {
      secret: seceret,
    });
  }

  validate(payload: any) {
    console.log(payload);
    return payload;
  }
}
