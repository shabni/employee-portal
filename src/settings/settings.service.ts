import { Injectable, NotFoundException } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateSettingDto } from './dto/role-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  createRole(createRoleDto: CreateRoleDto) {
    return this.prisma.roles.create({
      data: {
        roleId: MakeTimedIDUnique(),
        ...createRoleDto,
        ...datesForCreate(),
      },
    });
  }

  makePermissions(roles) {
    roles.forEach((element) => {
      if (element.permission) {
        element.permission = element.permission.split(',');
      }
    });

    return roles;
  }

  async findAllRoles() {
    let roles = await this.prisma.roles.findMany({
      select: {
        roleId: true,
        title: true,
        scale: true,
        permissions: true,
      },
    });

    return this.makePermissions(roles);
  }

  async findOne(id: string) {
    try {
      const role = await this.prisma.roles.findFirstOrThrow({
        where: {
          roleId: id,
        },
      });
      return role;
    } catch (exception) {
      throw new NotFoundException('Invalid Role Id');
    }
  }

  async updateRole(id: string, updateSettingDto: UpdateSettingDto) {
    const role = await this.prisma.roles.update({
      where: { roleId: id },
      data: { ...updateSettingDto, updatedAt: unixTimestamp() },
    });

    return role;
  }
}
