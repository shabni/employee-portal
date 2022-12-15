import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';



@Catch(HttpException)
export class HttpExceptionFilter implements  ExceptionFilter  {
  catch(exception: HttpException, host: ArgumentsHost) {

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    console.log(exception['response']['message'],"---------------------------------------->>>>")

    response
        .json({
            statusCode:exception['code'],
            message:exception['meta']
        })

  }
}