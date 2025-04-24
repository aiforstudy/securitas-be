import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is an array, transform each item
        if (Array.isArray(data)) {
          return data.map((item) => {
            if (item && typeof item === 'object' && 'constructor' in item) {
              const dto = item.constructor;
              if (dto.name.endsWith('Dto')) {
                return plainToInstance(dto, item, {
                  excludeExtraneousValues: true,
                  enableImplicitConversion: true,
                });
              }
            }
            return item;
          });
        }

        // If data is a single object
        if (data && typeof data === 'object' && 'constructor' in data) {
          const dto = data.constructor;
          if (dto.name.endsWith('Dto')) {
            return plainToInstance(dto, data, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            });
          }
        }

        return data;
      }),
    );
  }
}
