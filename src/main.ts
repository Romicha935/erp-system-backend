import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);
  next();
});
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://erp-system-hr.vercel.app',   
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
      enableImplicitConversion: true,  
    },   
     
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
