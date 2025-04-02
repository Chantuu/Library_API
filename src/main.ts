import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SwaggerUI Setup
  const config = new DocumentBuilder()
    .setTitle('Simple Library API')
    .setDescription('Documentation describing how API endpoints work.')
    .setVersion('1.0.0')
    .addBasicAuth(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Token for authorization',
      },
      'jwtAuth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // whitelist: true automatically strips any request body properties not present in defined DTO classes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
