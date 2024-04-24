import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class AddCarInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  brand: string;

  @Field(() => Int)
  @IsNumber()
  make: number;
}
