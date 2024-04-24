import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcryptjs';
import { Field, ObjectType } from '@nestjs/graphql';
import { Car } from 'src/cars/cars.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Field(() => [Car])
  @OneToMany(() => Car, (Car) => Car.user)
  cars: Car[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) this.password = await hash(this.password, 10);
  }
}
