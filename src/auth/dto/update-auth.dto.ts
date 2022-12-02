import { PartialType } from '@nestjs/swagger';
import { LogInDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(LogInDto) {}
