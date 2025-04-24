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
        let transformedData: any;

        // If data is an array, transform each item
        if (Array.isArray(data)) {
          transformedData = data.map((item) => {
            if (item && typeof item === 'object' && 'constructor' in item) {
              return plainToInstance(item.constructor, item, {
                excludeExtraneousValues: true,
              });
            }
            return item;
          });
        } else if (data && typeof data === 'object' && 'constructor' in data) {
          // If data is a single object
          transformedData = plainToInstance(data.constructor, data, {
            excludeExtraneousValues: true,
          });
        } else {
          transformedData = data;
        }

        return {
          data: transformedData,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode: response.statusCode,
            message: data?.message,
          },
        };
      }),
    );
  }
}
