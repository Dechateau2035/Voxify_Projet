import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChantsModule } from './chants/chants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { CLoudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_CONNECT: Joi.string().required(),
      })
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT!),
    ChantsModule,
    CLoudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
