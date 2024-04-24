import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { AddCarInput } from './add-car.input';

@InputType()
export class UpdateCarInput extends PartialType(AddCarInput) {
  @Field({ nullable: true })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  brand: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  make: number;
}
