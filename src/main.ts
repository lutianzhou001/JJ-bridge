import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('2.0')
    .addTag('managements')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('document', app, document);

  app.enableCors();
  app.use('/public', express.static(join(__dirname, '../../public')));
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  await app.listen(3000);
}
bootstrap();
