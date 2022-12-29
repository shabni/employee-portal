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

  findOne(id: string) {
    return this.prisma.users.findFirstOrThrow({
      select: {
        fName: true,
      },
      where: { userId: id },
    });
  }

  async updateUser(id: string, logInUserDto: any) {
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: { ...logInUserDto, updatedAt: unixTimestamp() },
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
    let roles = await this.findGreaterRoles(scale.scale);
    const resp = await this.prisma.users.findMany({
      select: {
        userId: true,
        fName: true,
      },
      where: { OR: roles },
    });

    return resp;
  }
}
