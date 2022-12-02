import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LogInDto, logInUserDto, logOutUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logIn')
  logIn(@Body() createAuthDto: LogInDto) {
    return this.authService.LogIn(createAuthDto);
  }

  @Post('/logOut')
  logOut(@Body() createAuthDto: logOutUserDto) {
    return this.authService.LogOut(createAuthDto);
  }

}
