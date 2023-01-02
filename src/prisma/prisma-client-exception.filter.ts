import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let message = exception.message.replace(/\n/g, '');
    let status = null;

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        break;
      }
      case 'P2003': {
        status = HttpStatus.CONFLICT;
        let columnName = exception.meta.field_name;
        message = `Must be valid ${columnName}`;
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = `Record to update not found`;
        break;
      }
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Undocumented error with database';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
