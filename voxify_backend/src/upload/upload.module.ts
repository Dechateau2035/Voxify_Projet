import { Module } from '@nestjs/common';
import { CLoudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [CLoudinaryModule],
  controllers: [UploadController],
})
export class UploadModule {}
