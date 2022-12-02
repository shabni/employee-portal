import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { createCheckoutDto } from './dto/checkout-attendence.dto';

@Injectable()
export class AttendenceService {

  constructor(private prisma: PrismaService) {}

  create(createAttendenceDto: CreateAttendenceDto) {
    return this.prisma.attendence.create({data:{
      attendence_id: MakeTimedIDUnique(),
      ...createAttendenceDto,
      ...datesForCreate()
    }});;
  }

  async createOut(createCheckoutDto:createCheckoutDto){

    let id = await  this.prisma.attendence.findFirst({
      select: {attendence_id:true},
      where: { AND:[ {user_Id:  createCheckoutDto.user_Id , attendence_date: createCheckoutDto.attendence_date}]} })
      
    return this.update(id['attendence_id'], {check_out_time :createCheckoutDto['check_out_time']})
  }

  findAll() {
    return  this.prisma.attendence.findMany();;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendence`;
  }

  async update(id: string, updateAttendenceDto: UpdateAttendenceDto) {

    const resp = await this.prisma.attendence.update({

      where:{attendence_id : id},
      data:{...updateAttendenceDto}})

    return resp
  }

  remove(id: number) {
    return `This action removes a #${id} attendence`;
  }
}
