import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DataSerializer implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data: any) => plainToClass(this.dto, data, { exposeDefaultValues: true })));
  }
}
