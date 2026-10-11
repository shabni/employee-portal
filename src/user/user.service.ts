import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.teamLeadId) {
      await this.validateTeamLead(createUserDto.roleId, createUserDto.teamLeadId);
    }
    return this.prisma.users.create({
      data: {
        userId: MakeTimedIDUnique(),
        ...createUserDto,
        joiningDate: BigInt(createUserDto.joiningDate),
        ...datesForCreate(),
      },
      select: {
        userId: true,
        fName: true,
        lName: true,
        userName: true,
        joiningDate: true,
        nic: true,
        roleId: true,
        emailOffice: true,
        phone: true,
        address: true,
        profileImage: true,
        designation: true,
        teamLeadId: true,
      },
    });
  }

  findAll() {
    return this.prisma.users.findMany({
      select: {
        userId: true,
        fName: true,
        lName: true,
        userName: true,
        fatherName: true,
        joiningDate: true,
        nic: true,
        isLoggedIn: true,
        isCheckedIn: true,
        roleId: true,
        role: { select: { title: true, scale: true } },
        emailOffice: true,
        address: true,
        phone: true,
        profileImage: true,
        designation: true,
        teamLeadId: true,
      },
    });
  }

  async findOne(id: string) {
    let data: ResponseUserDto = {};
    const user = await this.prisma.users.findFirst({
      select: {
        userId: true,
        fName: true,
        lName: true,
        userName: true,
        fatherName: true,
        joiningDate: true,
        isLoggedIn: true,
        isCheckedIn: true,
        roleId: true,
        role: { select: { title: true, scale: true, permissions: true } },
        emailOffice: true,
        address: true,
        phone: true,
        profileImage: true,
        designation: true,
        teamLeadId: true,
      },
      where: { userId: id },
    });
    if (user) data = user;
    return data;
  }

  async updateUser(id: string, updatelogedInUserDto: any) {
    const existing = await this.prisma.users.findUnique({
      where: { userId: id },
      select: { roleId: true, teamLeadId: true },
    });
    if (!existing) throw new BadRequestException('Employee not found');
    const roleId = updatelogedInUserDto.roleId ?? existing.roleId;
    const teamLeadId = Object.prototype.hasOwnProperty.call(updatelogedInUserDto, 'teamLeadId')
      ? updatelogedInUserDto.teamLeadId
      : existing.teamLeadId;
    if (teamLeadId) await this.validateTeamLead(roleId, teamLeadId, id);
    const updateData = { ...updatelogedInUserDto, updatedAt: unixTimestamp() };
    if (updatelogedInUserDto.joiningDate !== undefined) {
      updateData['joiningDate'] = BigInt(updatelogedInUserDto.joiningDate);
    }
    const resp = await this.prisma.users.update({
      where: { userId: id },
      data: updateData,
    });
    return resp;
  }

  private async validateTeamLead(roleId?: string, teamLeadId?: string, employeeId?: string) {
    if (!roleId) throw new BadRequestException('Assign an employee role before assigning a team lead');
    if (employeeId && employeeId === teamLeadId) {
      throw new BadRequestException('An employee cannot report to themselves');
    }
    const [employeeRole, lead] = await Promise.all([
      this.prisma.roles.findUnique({ where: { roleId } }),
      this.prisma.users.findUnique({
        where: { userId: teamLeadId },
        select: { userId: true, roleId: true, isDeleted: true },
      }),
    ]);
    if (!employeeRole || !lead || lead.isDeleted || !lead.roleId) {
      throw new BadRequestException('The selected team lead or role is invalid');
    }
    const leadRole = await this.prisma.roles.findUnique({ where: { roleId: lead.roleId } });
    if (!leadRole || leadRole.scale <= employeeRole.scale) {
      throw new BadRequestException('A team lead must have a higher role level than the employee');
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
          lName: true,
          designation: true,
          roleId: true,
          role: { select: { title: true, scale: true } },
        },
        where: { OR: roles, isDeleted: false },
        orderBy: [{ role: { scale: 'asc' } }, { fName: 'asc' }],
      });
    }
    return data;
  }
}
