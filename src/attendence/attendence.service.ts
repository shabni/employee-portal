import { Injectable, NotFoundException } from '@nestjs/common';
import {
  datesForCreate,
  MakeTimedIDUnique,
  unixTimestamp,
} from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { createCheckoutDto } from './dto/checkout-attendence.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AttendenceService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  async checkIn(createAttendenceDto: CreateAttendenceDto) {
    await this.userService.updateUser(createAttendenceDto.userId, {
      isCheckedIn: true,
    });

    const userId = createAttendenceDto.userId;

    const attendence = await this.createAttendence(createAttendenceDto);

    let payload = {
      isCheckedIn: true,
      checkInTime: attendence.checkInTime,
      attendenceDate: attendence.attendenceDate,
    };

    await this.authService.updateSession(userId, payload);

    return attendence;
  }

  async createAttendence(createAttendenceDto: CreateAttendenceDto) {
    const attendence = await this.prisma.attendence.create({
      data: {
        attendenceId: MakeTimedIDUnique(),
        ...createAttendenceDto,
        ...datesForCreate(),
      },
    });

    return attendence;
  }

  async createOut(createCheckoutDto: createCheckoutDto) {
    const userId = createCheckoutDto.userId;

    const id = await this.prisma.attendence.findFirst({
      select: { attendenceId: true },
      where: {
        AND: [
          {
            userId: createCheckoutDto.userId,
            attendenceDate: createCheckoutDto.attendenceDate,
          },
        ],
      },
    });

    if (id) {
      this.userService.updateUser(createCheckoutDto.userId, {
        isCheckedIn: false,
      });

      let payload = {
        isCheckedIn: false,
        checkInTime: null,
        attendenceDate: null,
      };

      await this.authService.updateSession(userId, payload);

      return this.update(id.attendenceId, {
        checkOutTime: createCheckoutDto.checkOutTime,
      });
    } else throw new NotFoundException('Please check in first');
  }

  getUserAttendence(id: string) {
    return this.prisma.attendence.findMany({
      select: {
        attendenceDate: true,
        attendenceId: true,
        checkInTime: true,
        checkOutTime: true,
        userId: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 7,
      where: {
        AND: [{ userId: id, NOT: { checkOutTime: null } }],
      },
    });
  }

  async update(id: string, updateAttendenceDto: UpdateAttendenceDto) {
    const resp = await this.prisma.attendence.update({
      where: { attendenceId: id },
      data: { ...updateAttendenceDto, updatedAt: unixTimestamp() },
    });

    return resp;
  }
}
