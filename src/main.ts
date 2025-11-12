import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4321'], // Astro frontend
    credentials: true,
  });
  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 5000}`);
}
bootstrap();
