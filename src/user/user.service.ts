import { Injectable } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { teamLeadResponse } from './dto/team-lead-response.dto';
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
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    let data: ResponseUserDto = {};
    const user = await this.prisma.users.findFirst({
      select: {
        fName: true,
      },
      where: { userId: id },
    });
    if (user) data = user;
    return data;
  }

  async updateUser(id: string, updatelogedInUserDto: any) {
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: { ...updatelogedInUserDto, updatedAt: unixTimestamp() },
    });
    return resp;
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
      select: { roleId: true },
      where: { scale: { gt: scale } },
    });
  }

  async getTeamLeads(roleId: string) {
    let scale = await this.findRole(roleId);

    let data: teamLeadResponse[] = [];
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
