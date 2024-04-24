import { Module } from '@nestjs/common';
import { CarsResolver } from './cars.resolver';
import { CarsService } from './cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [CarsResolver, CarsService],
  exports: [CarsService]
})
export class CarsModule {}
