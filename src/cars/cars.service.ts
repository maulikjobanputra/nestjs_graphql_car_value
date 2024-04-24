import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './cars.entity';
import { User } from 'src/users/user.entity';
import { AddCarInput } from './inputs/add-car.input';
import { GraphQlException } from 'src/utils/graphql-exception';
import { Exceptions } from 'src/constants/exceptions';

@Injectable()
export class CarsService {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) {}

  async create(addCarInput: AddCarInput, user: User): Promise<string> {
    try {
      const car = this.carRepository.create(addCarInput);
      car.user = user;
      await this.carRepository.save(car);
      return `Successfully added a new car with ${car.id} carId!`;
    } catch (error) {
      console.log(`Error while adding a new Car!`);
      throw error;
    }
  }

  async findByUserId(id: string): Promise<Car[]> {
    try {
      return await this.carRepository.find({ where: { user: { id } } });
    } catch (error) {
      console.log(`Error while getting Cars for a specific User!`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Car> {
    try {
      const car = await this.carRepository.findOne({ where: { id } });
      if (!car) throw new GraphQlException(`No car found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      return car;
    } catch (error) {
      console.log(`Error while getting a Car !`);
      throw error;
    }
  }

  async find(): Promise<Car[]> {
    try {
      return await this.carRepository.find();
    } catch (error) {
      console.log(`Error while getting all the Cars!`);
      throw error;
    }
  }
  async update(id: string, body: Partial<Car>): Promise<string> {
    try {
      const car = await this.carRepository.findOne({ where: { id } });
      if (!car) throw new GraphQlException(`No car found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      Object.assign(car, body);
      await this.carRepository.save(car);
      return `Successfully updated the Car!`;
    } catch (error) {
      console.log(`Error while getting all the cars!`);
      throw error;
    }
  }
  async remove(id: string): Promise<string> {
    try {
      const car = await this.carRepository.findOne({ where: { id } });
      if (!car) throw new GraphQlException(`No car found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      await this.carRepository.remove(car);
      return `Successfully removed the Car!`;
    } catch (error) {
      console.log(`Error while removing the Car!`);
      throw error;
    }
  }
}
