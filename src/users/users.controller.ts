import { Body, Controller, Delete, Get, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateUserDto } from './inputs/create-user.input';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './inputs/update-user.input';
import { ClassDataSerializer } from 'src/decorators/class-data-serializer.decorator';
import { SignInUserDto } from './inputs/sign-in-user.input';
import { ObjectType } from 'src/interfaces/common';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('auth')
@ClassDataSerializer(User)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDto, @Session() session: { [key: string]: any }): Promise<string> {
    return this.usersService.create(createUserDto, session);
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
  updateUser(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User): Promise<string> {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete('/')
  deleteUser(@Query('id') id: string, @GetUser() user: User): Promise<string> {
    return this.usersService.remove(id, user);
  }

  @Post('/signin')
  signInUser(@Body() signInUserDto: SignInUserDto, @Session() session: ObjectType): Promise<string> {
    return this.usersService.signIn(signInUserDto, session);
  }

  @Post('/signout')
  signOutUser(@Session() session: { [key: string]: any }): string {
    return this.usersService.signOut(session);
  }
}
