import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? { message: res } : res;
    } else if (
      exception instanceof QueryFailedError &&
      (exception as any).errno === 1062
    ) {
      status = HttpStatus.CONFLICT;
      const detail = (exception as any).sqlMessage || exception.message;
      message = { message: `Duplicate entry: ${detail}` };
    } else if (
      exception?.message?.toLowerCase().includes('not found') ||
      exception?.name === 'EntityNotFoundError'
    ) {
      status = HttpStatus.NOT_FOUND;
      message = { message: exception.message };
    } else {
      status = HttpStatus.BAD_REQUEST;
      message = { message: 'An unexpected error occurred. Please try again.' };
    }

    this.logger.error(
      `Status: ${status} Error: ${JSON.stringify(message)}`,
      exception.stack,
    );

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message: message?.message || message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
