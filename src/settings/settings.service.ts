import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  createRole(createRoleDto: CreateRoleDto) {
    const createdAt = datesForCreate()['date_added'];
    const updatedAt = datesForCreate()['date_updated'];

    return this.prisma.roles.create({
      data: {
        role_id: MakeTimedIDUnique(),
        ...createRoleDto,
        createdAt,
        updatedAt,
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
        role_id: true,
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
        role_id: id,
      },
    });
  }

  async updateRole(id: string, updateSettingDto: UpdateSettingDto) {
    const role = await this.prisma.roles.update({
      where: { role_id: id },
      data: { ...updateSettingDto },
    });

    return role;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
