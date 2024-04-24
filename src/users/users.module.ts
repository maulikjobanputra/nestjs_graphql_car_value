import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CarsModule],
  controllers: [],
  providers: [UsersService, UsersResolver]
})
export class UsersModule {}
