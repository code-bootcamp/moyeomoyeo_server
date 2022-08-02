import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://momoyeo.site',
      'https://moyeomoyeo.site',
      'http://moyeomoyeo.site',
    ],
    credentials: true,
    exposedHeaders: ['Authorization', 'Set-Cookie', 'Cookie', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  });
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
