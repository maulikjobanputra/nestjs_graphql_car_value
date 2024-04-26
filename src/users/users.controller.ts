import { Body, Controller, Delete, Get, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserInput } from './inputs/update-user.input';
import { ClassDataSerializer } from 'src/decorators/class-data-serializer.decorator';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { ObjectType } from 'src/interfaces/common';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('auth')
@ClassDataSerializer(User)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() createUserInput: CreateUserInput, @Session() session: { [key: string]: any }): Promise<string> {
    return this.usersService.create(createUserInput, session);
  }

  @Get('/user')
  getUser(@Query('id') id: string, @GetUser() user: User): Promise<User | string> {
    return this.usersService.findOne(id, user);
  }

  @Get('/users')
  getUsers() {
    return this.usersService.find();
  }

  @Patch('/')
  updateUser(
    @Query('id') id: string,
    @Body() updateUserInput: UpdateUserInput,
    @GetUser() user: User
  ): Promise<string> {
    return this.usersService.update(id, updateUserInput, user);
  }

  @Delete('/')
  deleteUser(@Query('id') id: string, @GetUser() user: User): Promise<string> {
    return this.usersService.remove(id, user);
  }

  @Post('/signin')
  signInUser(@Body() signInUserInput: SignInUserInput, @Session() session: ObjectType): Promise<string> {
    return this.usersService.signIn(signInUserInput, session);
  }

  @Post('/signout')
  signOutUser(@Session() session: { [key: string]: any }): string {
    return this.usersService.signOut(session);
  }
}
