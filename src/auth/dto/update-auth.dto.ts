import { PartialType } from '@nestjs/swagger';
import { LogInDto } from './login.dto';

export class UpdateAuthDto extends PartialType(LogInDto) {}
