import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDto, logInUserDto, logOutUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService) {}

  async LogIn(LogInDto: LogInDto) {

    const user = await this.prisma.user.findFirst({
      where: {
          userName:LogInDto.userName, 
        },
      });

      if (user.userName === LogInDto.userName && user.password === LogInDto.password){

        this.updateUser(user.user_id,{is_LoggedIn:true})
        user.is_LoggedIn=true
        return user
      }
      else throwError
      }

    async LogOut(logOutUserDto: logOutUserDto) {
      this.updateUser(logOutUserDto.user_id,{is_LoggedIn:false})
  }



  async updateUser(id: string, logInUserDto: logInUserDto) {

    const resp = await this.prisma.user.update({

      where:{user_id : id},
      data:{...logInUserDto}})

    return resp
  }


}
