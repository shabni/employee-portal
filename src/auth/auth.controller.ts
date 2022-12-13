import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LogInDto, logInUserDto, logOutUserDto, createSessionDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('api/auth')
@ApiTags('Authorization')
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

  @Post('/createSession')
  createSession(@Body() createAuthDto: createSessionDto) {
    return this.authService.createSession(createAuthDto);
  }

  @Get('/session')
  getSession() {
    return this.authService.getSession();
  }

}
