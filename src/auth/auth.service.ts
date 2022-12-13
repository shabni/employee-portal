import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDto, logInUserDto, logOutUserDto, createSessionDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async LogIn(LogInDto: LogInDto) {

    const user = await this.prisma.user.findFirst({
      where: {
          userName:LogInDto.userName, 
        },
      });

      if (user.is_CheckedIn)
      {
        let x = await this.findUserAttendenceTime(user.user_id)
        user['attendence_date'] = x['attendence_date']
        user['check_in_time'] = x['check_in_time']
      }

      // if (user.is_LoggedIn)
      // {
      //   return user
      // }

      if (user.userName === LogInDto.userName && user.password === LogInDto.password){

        this.updateUser(user.user_id,{is_LoggedIn:true})
        user.is_LoggedIn=true
        let session = await this.getUserSession(user.userName)

        if (session){
          session['sessionExist'] = true
          return session
        }
        else {
          user['sessionExist'] = false
          return user}
      }
      else throwError
  }

  async LogOut(logOutUserDto: logOutUserDto) {
      this.updateUser(logOutUserDto.user_id,{is_LoggedIn:false})

      this.removeSession(logOutUserDto.userName)
  }
  
  async removeSession(userName: string) {
    const dleted = await  this.prisma.session.deleteMany({
      where:{
        userName : userName
      }
    })
    return dleted
  }



  async updateUser(id: string, logInUserDto: logInUserDto) {

    const resp = await this.prisma.user.update({

      where:{user_id : id},
      data:{...logInUserDto}})

    return resp
  }

  async findUserAttendenceTime(id: string) {

    const attendence = await this.prisma.attendence.findMany({
      where: {
        user_Id: id
      }
    });
    return attendence[attendence.length-1]
  }

  async getUserSession(userName) {

    const session = await this.prisma.session.findFirst({
      where: {
          userName:userName, 
        },
      });

      return session
  }

  async getSession(){
     let data = await this.prisma.session.findMany({
      orderBy:[{
        date_updated: 'desc'
      }],
      take: 1
     });

     if (data){
      return data[0]
     }
     else return {}
  }

  createSession(createSessionDto :createSessionDto) {
    return this.prisma.session.create({data:{
      session_id: MakeTimedIDUnique(),
      ...createSessionDto,
      ...datesForCreate()
    }});
  }

  async updateSession(userName: string, updateSessionDto: any) {

    const resp = await this.prisma.session.update({

      where:{userName : userName},
      data:{...updateSessionDto}})

    return resp
  }

}
