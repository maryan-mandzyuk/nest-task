import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import { appConfig } from './AppConfig';
import { TOKEN_KEY } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('NestJs Project')
    .setDescription('Products, logs, users, auth')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
    })
    .addApiKey({
      name: TOKEN_KEY.REFRESH,
      type: 'apiKey',
      in: 'header',
      scheme: 'apiKey',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.PORT);
}
bootstrap();
