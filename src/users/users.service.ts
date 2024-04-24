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
      return `Successfully Signed In!`;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, body: Partial<User>): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      Object.assign(user, body);
      await this.userRepository.save(user);
      return `Successfully Updated User!`;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new GraphQlException(`No user found with ${id} id!`, 404, Exceptions.NOT_FOUND);
      await this.userRepository.remove(user);
      return `Successfully Removed User!`;
    } catch (error) {
      throw error;
    }
  }
  signOut(session: ObjectType): string {
    delete session.token;
    return `Successfully Signed Out!`;
  }
}
