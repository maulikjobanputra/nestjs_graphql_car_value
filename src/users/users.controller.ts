import { Body, Controller, Delete, Get, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ClassDataSerializer } from 'src/decorators/class-data-serializer.decorator';
import { SignInUserDto } from './dtos/sign-in-user.dto';
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
  getUser(@Query('id') id: string, @GetUser() _user: User): Promise<User | string> {
    return this.usersService.findOne(id);
  }

  @Get('/users')
  getUsers() {
    return this.usersService.find();
  }

  @Patch('/')
  updateUser(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/')
  deleteUser(@Query('id') id: string, @GetUser() _user: User): Promise<string> {
    return this.usersService.remove(id);
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
