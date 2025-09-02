import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from './decorators/response-message.decorator';

export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => ({
          data,
          message: Reflect.getMetadata(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ),
        })),
      );
  }
}
