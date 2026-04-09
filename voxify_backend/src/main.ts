import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  /*Configurartion de Swagger*/
  const config = new DocumentBuilder()
    .setTitle('Voxify\'s API documentation')
    .setDescription('La documentation complète de l\'API de Voxify')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  /*******************************************************/

  await app.listen(process.env.PORT!);
}
bootstrap();