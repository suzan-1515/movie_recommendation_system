import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

// This is the entry point of the application. 
// Bootstrap the Nestjs configuration to the application that includes the validation pipe, swagger, and the configuration service. 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Loads environment variables from .env file using Nestjs default ConfigService
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  // Enables validation for the incoming requests
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Bootstrap static files directory. In this case, the directory is public.
  // The public directory is used to serve static files such as images, css, and javascript files.
  app.useStaticAssets('public', {
    index: false,
    prefix: '/public',
  });

  // Swagger configuration for the API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movie Recommendation System API')
    .setDescription('Movie Recommendation System API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);

  console.log(`http://localhost:${port}/api/swagger`);

  // Start the application on the specified port defined in the environment variables
  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${port}`);
  });
}
bootstrap();
