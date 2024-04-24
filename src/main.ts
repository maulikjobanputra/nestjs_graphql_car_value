require('dotenv').config();
import * as session from 'express-session';
import { useContainer } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const { PORT, SESSION_SECRET } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  );
  await app.listen(PORT);
}
bootstrap();
