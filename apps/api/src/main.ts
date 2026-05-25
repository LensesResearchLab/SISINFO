import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PeriodsService } from './periods/periods.service';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ limit: '5mb', extended: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Sisinfo API')
    .setDescription('Sisinfo API documentation')
    .setVersion('1.0')
    .addTag('Sisinfo')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  // Ensure templates exist for existing periods on startup
  try {
    const periodsService = app.get(PeriodsService);
    await periodsService.ensureTemplatesForAllPeriods(false);
    console.log('Templates ensured for existing periods');
  } catch (err) {
    console.error('Error ensuring templates on startup', err);
  }

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
