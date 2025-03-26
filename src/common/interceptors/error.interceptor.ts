import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ValidationError {
  message: string;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        // Handle NotFoundException
        if (error instanceof NotFoundException) {
          return throwError(() => ({
            message: error.message,
            error: 'Not Found',
            statusCode: 404,
          }));
        }

        // Handle BadRequestException
        if (error instanceof BadRequestException) {
          return throwError(() => ({
            message: error.message,
            error: 'Bad Request',
            statusCode: 400,
          }));
        }

        // Handle TypeORM errors
        if (error.name === 'QueryFailedError') {
          // Handle unique constraint violations
          if (error.code === '23505') {
            const column = error.detail.match(/Key \((.*?)\)=/)[1];
            return throwError(() => ({
              message: `A record with this ${column} already exists`,
              error: 'Bad Request',
              statusCode: 400,
            }));
          }
          // Handle foreign key violations
          if (error.code === '23503') {
            const column = error.detail.match(/Key \((.*?)\)=/)[1];
            return throwError(() => ({
              message: `Referenced ${column} does not exist`,
              error: 'Bad Request',
              statusCode: 400,
            }));
          }
          // Handle not null violations
          if (error.code === '23502') {
            const column = error.column;
            return throwError(() => ({
              message: `${column} cannot be null`,
              error: 'Bad Request',
              statusCode: 400,
            }));
          }
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = error.errors as ValidationError[];
          const errorMessage = validationErrors
            .map((err) => err.message)
            .join(', ');
          return throwError(() => ({
            message: errorMessage,
            error: 'Bad Request',
            statusCode: 400,
          }));
        }

        // Handle other errors
        return throwError(() => ({
          message: 'An unexpected error occurred',
          error: 'Internal Server Error',
          statusCode: 500,
        }));
      }),
    );
  }
}
