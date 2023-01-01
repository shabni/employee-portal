import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LogInDto,
  logOutUserDto,
  createSessionDto,
} from './dto/create-auth.dto';

@Controller('api/auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logIn')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.LogIn(logInDto);
  }

  @Post('logOut')
  logOut(@Body() logOutDto: logOutUserDto) {
    return this.authService.LogOut(logOutDto);
  }

  @Post('createSession')
  createSession(@Body() createAuthDto: createSessionDto) {
    return this.authService.createSession(createAuthDto);
  }

  @Post('session')
  getSession(@Body() token: any) {
    return this.authService.getSession(token);
  }
}
