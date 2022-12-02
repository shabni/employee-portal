import { Injectable } from '@nestjs/common';
import { throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

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
        return user
      }
      else throwError
  }

  

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
