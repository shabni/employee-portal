import { Injectable } from '@nestjs/common';
import { datesForCreate, MakeTimedIDUnique } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}
  
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({data:{
      user_id: MakeTimedIDUnique(),
      ...createUserDto,
      ...datesForCreate()
    }});
  }

  findAll() {
    // return `This action returns all user`;
    return this.prisma.user.findMany({select:{
      user_id:true,
      fName: true,
      lName: true,
      fatherName: true,
      joining_date: true,
      nic: true,
      emailOffice: true,
      address: true,
      phone: true,
    }});
  }

  findOne(id: string) {
    return this.prisma.user.findFirstOrThrow({
      select:{
        fName:true
      },
      where: { user_id: id},
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updateUser(id: string, logInUserDto: any) {

    const resp = await this.prisma.user.update({

      where:{user_id : id},
      data:{...logInUserDto}})

    return resp
  }
}
