import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LogOutUserDto, GetSessionDto } from './dto/create-auth.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { LogInDto } from './dto/login.dto';

@Controller('api/auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logIn')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.LogIn(logInDto);
  }

  @Post('logOut')
  logOut(@Body() logOutDto: LogOutUserDto) {
    return this.authService.LogOut(logOutDto);
  }

  @Post('createSession')
  createSession(@Body() createAuthDto: CreateSessionDto) {
    return this.authService.createSession(createAuthDto);
  }

  @Post('session')
  getSession(@Body() token: GetSessionDto) {
    return this.authService.getSession(token);
  }
}
