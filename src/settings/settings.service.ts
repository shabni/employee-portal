import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {

  constructor(private prisma: PrismaService) {}
  
  createRole(createRoleDto: CreateRoleDto) {
    
    const createdAt = datesForCreate()['date_added']
    const updatedAt  = datesForCreate()['date_updated']

    return this.prisma.roles.create({data:{
      role_id: MakeTimedIDUnique(),
      ...createRoleDto,
      createdAt,
      updatedAt
    }});
  }

  findAllRoles() {
    return this.prisma.roles.findMany({select:{
      role_id:true,
      title: true,
      scale:true,
    }});
  }

  findOne(id: string) {
    return this.prisma.roles.findFirst({
      where:{
        role_id:id
      }
    });
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
