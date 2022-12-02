import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logIn')
  logIn(@Body() createAuthDto: LogInDto) {
    return this.authService.LogIn(createAuthDto);
  }

  @Post('/logOut')
  logOut(@Body() createAuthDto: LogInDto) {
    return this.authService.LogIn(createAuthDto);
  }

}
