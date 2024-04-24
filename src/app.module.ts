import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { IsUniqueConstraint } from './utils/unique-validator';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { errorFormatter } from './utils/graphql-error-formatter';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/cars.entity';

const { DB_PORT, DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: errorFormatter
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: DB_USERNAME,
      host: DB_HOST,
      port: Number(DB_PORT),
      database: DB_NAME,
      password: DB_PASSWORD,
      entities: [User, Car],
      synchronize: true
    }),
    UsersModule,
    CarsModule
  ],
  providers: [
    IsUniqueConstraint
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseWrapper
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomFilter
    // }
  ]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).exclude('/auth/sign(.*)').forRoutes('*');
  // }
}
