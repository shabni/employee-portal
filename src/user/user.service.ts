import { Injectable } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        userId: MakeTimedIDUnique(),
        ...createUserDto,
        ...datesForCreate(),
      },
    });
  }

  findAll() {
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
    });
  }

  async findOne(id: string) {
    let data = {};
    const user = await this.prisma.users.findFirst({
      select: {
        fName: true,
      },
      where: { userId: id },
    });
    if (user) data = user;
    return data;
  }

  async updateUser(id: string, logInUserDto: any) {
    try {
      const resp = await this.prisma.users.update({
        where: { userId: id },
        data: { ...logInUserDto, updatedAt: unixTimestamp() },
      });
      return resp;
    } catch (exception) {
      throw exception;
    }
  }

  findRole(id: string) {
    return this.prisma.roles.findFirst({
      select: { scale: true },
      where: {
        roleId: id,
      },
    });
  }

  findGreaterRoles(scale: number) {
    return this.prisma.roles.findMany({
      select: {
        roleId: true,
      },
      where: {
        scale: {
          gt: scale,
        },
      },
    });
  }

  async getTeamLeads(roleId: string) {
    let scale = await this.findRole(roleId);

    let data = {};
    if (scale) {
      let roles = await this.findGreaterRoles(scale.scale);
      data = await this.prisma.users.findMany({
        select: {
          userId: true,
          fName: true,
        },
        where: { OR: roles },
      });
    }
    return data;
  }
}
