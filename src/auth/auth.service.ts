import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import jwt_decode from 'jwt-decode';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogOutUserDto } from './dto/create-auth.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { LogInResponseDto } from './dto/login-response.dto';
import { LogInDto } from './dto/login.dto';
import { UpdatelogedInUserDto } from './dto/update-logedin-user.dto';

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
      if (
        user.userName === LogInDto.userName &&
        user.password === LogInDto.password
      ) {
        const token = await this.logInToken(user.userId, user.userName);
        this.updateUser(user.userId, { isLoggedIn: true });

        const session = await this.getUserSession(user.userId);

        let sessionResponse: LogInResponseDto = {};

        if (Object.keys(session).length > 0) {
          sessionResponse = session;
          sessionResponse.profile.token = token;

          return sessionResponse;
        } else {
          const { teamLeadId, nic, ...data } = user;

          let session = await this.createSession(data);
          sessionResponse = session;
          sessionResponse.profile.token = token;

          return sessionResponse;
        }
      } else
        throw new UnauthorizedException(
          'User name and password does not match!',
        );
    } else throw new UnauthorizedException('User does not exist!');
  }

  async LogOut(logOutUserDto: LogOutUserDto) {
    await this.updateUser(logOutUserDto.userId, { isLoggedIn: false });
    await this.removeSession(logOutUserDto.userId);
  }

  async removeSession(userId: string) {
    const removed = await this.prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });
    return removed;
  }

  async updateUser(id: string, updatelogedInUserDto: UpdatelogedInUserDto) {
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: { ...updatelogedInUserDto, updatedAt: unixTimestamp() },
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
    let data: LogInResponseDto = {};
    const session = await this.prisma.session.findFirst({
      where: {
        userId,
      },
    });

    if (session) {
      data.session = true;
      data.profile = session;

      if (session.isCheckedIn) {
        let userAttendence = await this.findUserAttendenceTime(session.userId);
        data.profile.attendenceDate = userAttendence.attendenceDate;
        data.profile.checkInTime = userAttendence.checkInTime;
      }
      let permissions = await this.findRole(data.profile.roleId);
      if (permissions.permissions)
        data.permissions = this.makePermissions(permissions.permissions);
    }

    return data;
  }

  async findRole(id: string) {
    try {
      const role = await this.prisma.roles.findUniqueOrThrow({
        select: { permissions: true },
        where: {
          roleId: id,
        },
      });
      return role;
    } catch (error) {
      throw new NotFoundException('Role does not exist');
    }
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
      data = await this.getUserSession(decoded['userId']);
    } else {
      data['session'] = false;
    }

    return data;
  }

  async createSession(createSessionDto: CreateSessionDto) {
    let data: LogInResponseDto = {};

    let session = await this.prisma.session.create({
      data: {
        sessionId: MakeTimedIDUnique(),
        ...createSessionDto,
        ...datesForCreate(),
      },
    });

    data.profile = session;
    let permissions = await this.findRole(data.profile.roleId);
    if (permissions.permissions)
      data.permissions = this.makePermissions(permissions.permissions);

    if (data.profile.isCheckedIn) {
      let userAttendence = await this.findUserAttendenceTime(
        data.profile.userId,
      );
      data.profile.isCheckedIn = userAttendence['isCheckedIn'];
      data.profile.attendenceDate = userAttendence.attendenceDate;
      data.profile.checkInTime = userAttendence.checkInTime;
    }

    return data;
  }

  async updateSession(userId: string, updateSessionDto: any) {
    try {
      const resp = await this.prisma.session.update({
        where: { userId },
        data: { ...updateSessionDto, updatedAt: unixTimestamp() },
      });

      return resp;
    } catch (exception) {
      throw exception;
    }
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
}
