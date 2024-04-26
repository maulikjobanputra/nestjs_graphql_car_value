import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './inputs/create-user.input';
import { Session } from 'src/decorators/get-session.decorator';
import { ObjectType } from 'src/interfaces/common';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserInput } from './inputs/update-user.input';
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
  createUser(
    @Session() session: ObjectType,
    @Args('CreateUserInput') createUserInput: CreateUserInput
  ): Promise<string> {
    return this.usersService.create(createUserInput, session);
  }

  @Mutation(() => String)
  updateUser(
    @GetUser() user: User,
    @Args('id', { nullable: true }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ): Promise<string> {
    return this.usersService.update(id, updateUserInput, user);
  }

  @Mutation(() => String)
  signInUser(@Session() session: ObjectType, @Args('signInUserInput') signInUserInput: SignInUserInput) {
    return this.usersService.signIn(signInUserInput, session);
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
