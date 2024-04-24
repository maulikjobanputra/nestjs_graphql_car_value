import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { ObjectType } from 'src/interfaces/common';
import { genToken } from 'src/utils/gen-token';
import { GraphQlException } from 'src/utils/graphql-exception';
import { Exceptions } from 'src/constants/exceptions';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto, session: ObjectType): Promise<string> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      session.token = genToken(user.id);
      return `New User Created with id ${user.id}!`;
    } catch (error) {
      console.log(`Error while creating a new User!`);
      throw error;
    }
  }

  async findOne(id: string, loggedInUser: User): Promise<User> {
    try {
      if (!id) return loggedInUser;
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      return user;
    } catch (error) {
      console.log(`Error while getting a User!`);
      throw error;
    }
  }

  async find() {
    try {
      return this.userRepository.find();
    } catch (error) {
      console.log(`Error while getting all the Users!`);
      throw error;
    }
  }

  async update(id: string, body: Partial<User>, loggedInUser: User): Promise<string> {
    try {
      let user: User;
      if (!id) user = loggedInUser;
      else user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      delete user.password;
      Object.assign(user, body);
      await this.userRepository.save(user);
      return `Successfully updated the User!`;
    } catch (error) {
      console.log(`Error while updating a User!`);
      throw error;
    }
  }

  async remove(id: string, defaultUser: User): Promise<string> {
    try {
      let user: User;
      if (!id) user = defaultUser;
      else user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      await this.userRepository.remove(user);
      return `Successfully removed the User!`;
    } catch (error) {
      console.log(`Error while removing a User!`);
      throw error;
    }
  }

  async signIn(signInUserDto: SignInUserDto, session: ObjectType): Promise<string> {
    try {
      const { email, password } = signInUserDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new GraphQlException(`Invalid Credentials!`, 401, Exceptions.UNAUTHENTICATED);
      const result = await compare(password, user.password);
      if (!result) throw new GraphQlException(`Invalid Credentials!`, 401, Exceptions.UNAUTHENTICATED);
      session.token = genToken(user.id);
      return `Successfully signed-in!`;
    } catch (error) {
      console.log(`Error while signing-in a User!`);
      throw error;
    }
  }

  signOut(session: ObjectType): string {
    try {
      delete session.token;
      return `Successfully signed-out!`;
    } catch (error) {
      console.log(`Error while signing-out a User!`);
      throw error;
    }
  }
}
