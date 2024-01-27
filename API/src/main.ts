import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: false,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const configSW = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Swagger')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, configSW);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(
      '[API BASE URL]',
      `${config.get<string>('BASE_URL')}:${config.get<string>('PORT')}`,
    );
    console.log(
      '[API SWAGGER URL]',
      `${config.get<string>('BASE_URL')}:${config.get<string>('PORT')}/api`,
    );
  });
}
bootstrap();
