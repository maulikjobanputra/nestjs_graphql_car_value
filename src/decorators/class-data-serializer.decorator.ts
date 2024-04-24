import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { DataSerializer } from 'src/interceptors/data-serializer.interceptor';

export const ClassDataSerializer = (dto: ClassConstructor<any>) => UseInterceptors(new DataSerializer(dto));
