import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { createCheckoutDto } from './dto/checkout-attendence.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AttendenceService {

  constructor(private prisma: PrismaService, private readonly userService: UserService, private authService:AuthService) {}

  async checkIn(createAttendenceDto: CreateAttendenceDto) {

    this.userService.updateUser(createAttendenceDto.user_Id,{is_CheckedIn:true})

    let userName =  createAttendenceDto.userName;
    delete createAttendenceDto.userName;

    let attendence = await this.createAttendence(createAttendenceDto);

    let payload = {is_CheckedIn:true, check_in_time:attendence['check_in_time'], attendence_date:attendence['attendence_date']};

    this.authService.updateSession(userName,payload);


    return attendence
  }

  async createAttendence(createAttendenceDto: CreateAttendenceDto){

    let attendence = await this.prisma.attendence.create({data:{
      attendence_id: MakeTimedIDUnique(),
      ...createAttendenceDto,
      ...datesForCreate()
    }});

    return attendence

  }

  async createOut(createCheckoutDto:createCheckoutDto){

    let userName =  createCheckoutDto.userName;
    delete createCheckoutDto.userName;

    let id = await  this.prisma.attendence.findFirst({
      select: {attendence_id:true},
      where: { AND:[ {user_Id:  createCheckoutDto.user_Id , attendence_date: createCheckoutDto.attendence_date}]} })
      this.userService.updateUser(createCheckoutDto.user_Id,{is_CheckedIn:false})

      

    let payload = {is_CheckedIn:false, check_in_time:null, attendence_date:null};

    this.authService.updateSession(userName,payload);
      
    return this.update(id['attendence_id'], {check_out_time :createCheckoutDto['check_out_time']})
  }

  getUserAttendence(id: string) {
    return this.prisma.attendence.findMany({
      orderBy:[{
        date_updated: 'desc'
      }],
      take: 7,
      where: {
        AND:[{
          user_Id: id,
          NOT:{
            check_out_time:0,
          }
        }]
      }
     });
  }

  findAll() {
    return  this.prisma.attendence.findMany();
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
