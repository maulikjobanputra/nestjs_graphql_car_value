import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Session } from 'src/decorators/get-session.decorator';
import { ObjectType } from 'src/interfaces/common';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}
  @Query(() => [User])
  getUsers() {
    return this.usersService.find();
  }

  @Query(() => User)
  getUser(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => String)
  createUser(@Session() session: ObjectType, @Args('CreateUserInput') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, session);
  }

  @Mutation(() => String)
  updateUser(@Args('id') id: string, @Args('updateUserInput') updateUserInput: UpdateUserDto): Promise<string> {
    return this.usersService.update(id, updateUserInput);
  }
  @Mutation(() => String)
  signInUser(@Session() session: ObjectType, @Args('signInUserInput') signInUserDto: SignInUserDto) {
    return this.usersService.signIn(signInUserDto, session);
  }

  @Mutation(() => String)
  signOutUser(@Session() session: ObjectType) {
    return this.usersService.signOut(session);
  }

  @Mutation(() => String)
  removeUser(@Args('id') id?: string) {
    return this.usersService.remove(id);
  }
}
