import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { isUnique } from 'src/decorators/unique.decorator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  @isUnique({ tableName: 'users', column: 'email' })
  email: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
