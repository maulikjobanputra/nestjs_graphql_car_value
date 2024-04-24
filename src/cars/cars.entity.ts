import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Car {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  brand: string;

  @Field(() => Int)
  @Column()
  make: number;

  @ManyToOne(() => User, (User) => User.cars, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
