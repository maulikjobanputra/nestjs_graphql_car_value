import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Session } from 'src/decorators/get-session.decorator';
import { ObjectType } from 'src/interfaces/common';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Car } from 'src/cars/cars.entity';
import { CarsService } from 'src/cars/cars.service';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private carsService: CarsService
  ) {}
  @Query(() => [User])
  getUsers() {
    return this.usersService.find();
  }

  @Query(() => User)
  getUser(@Args('id', { nullable: true }) id: string, @GetUser() user: User): Promise<User> {
    return this.usersService.findOne(id, user);
  }

  @Mutation(() => String)
  createUser(@Session() session: ObjectType, @Args('CreateUserInput') createUserDto: CreateUserDto): Promise<string> {
    return this.usersService.create(createUserDto, session);
  }

  @Mutation(() => String)
  updateUser(
    @GetUser() user: User,
    @Args('id', { nullable: true }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserDto
  ): Promise<string> {
    return this.usersService.update(id, updateUserInput, user);
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
  removeUser(@Args('id', { nullable: true }) id: string, @GetUser() user: User): Promise<string> {
    return this.usersService.remove(id, user);
  }

  @ResolveField()
  cars(@Parent() user: User): Promise<Car[]> {
    return this.carsService.findByUserId(user.id);
  }
}
