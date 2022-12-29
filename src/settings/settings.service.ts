import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

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
      if (element['permissions']) {
        element['permissions'] = element['permissions'].split(',');
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

  findOne(id: string) {
    return this.prisma.roles.findFirst({
      where: {
        roleId: id,
      },
    });
  }

  async updateRole(id: string, updateSettingDto: UpdateSettingDto) {
    const role = await this.prisma.roles.update({
      where: { roleId: id },
      data: { ...updateSettingDto },
    });

    return role;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
