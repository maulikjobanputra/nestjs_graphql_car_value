import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddCarInput } from './inputs/add-car.input';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { CarsService } from './cars.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Car } from './cars.entity';
import { UpdateCarInput } from './inputs/update-car.input';

@Resolver()
@UseGuards(AuthGuard)
export class CarsResolver {
  constructor(private carsService: CarsService) {}

  @Mutation(() => String)
  addCar(@GetUser() user: User, @Args('addCarInput') addCarInput: AddCarInput): Promise<string> {
    return this.carsService.create(addCarInput, user);
  }

  @Query(() => [Car])
  getCars(): Promise<Car[]> {
    return this.carsService.find();
  }

  @Query(() => Car)
  getCar(@Args('id') id: string): Promise<Car> {
    return this.carsService.findOne(id);
  }

  @Query(() => [Car])
  getCarsForUser(@GetUser() user: User): Promise<Car[]> {
    return this.carsService.findByUserId(user.id);
  }

  @Mutation(() => String)
  updateCar(@Args('id') id: string, @Args('updateCarInput') updateCarInput: UpdateCarInput): Promise<string> {
    return this.carsService.update(id, updateCarInput);
  }

  @Mutation(() => String)
  removeCar(@Args('id') id: string): Promise<string> {
    return this.carsService.remove(id);
  }
}
