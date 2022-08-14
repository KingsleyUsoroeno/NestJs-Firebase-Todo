import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const serviceAccount = require("../serviceAccountKey.json");

  const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: configService.get<string>('API_KEY'),
    authDomain: configService.get<string>('AUTH_DOMAIN'),
    projectId: configService.get<string>('PROJECT_ID'),
    storageBucket: configService.get<string>('STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
    appId: configService.get<string>('APP_ID'),
  };

  admin.initializeApp(firebaseConfig);
  await app.listen(3000);
}
bootstrap();
