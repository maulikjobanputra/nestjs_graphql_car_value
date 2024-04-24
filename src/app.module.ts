import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { IsUniqueConstraint } from './utils/unique-validator';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { errorFormatter } from './utils/graphql-error-formatter';

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
      entities: [User, Report],
      synchronize: true
    }),
    UsersModule,
    ReportsModule
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseWrapper
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomFilter
    // },
    IsUniqueConstraint
  ]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).exclude('/auth/sign(.*)').forRoutes('*');
  // }
}
