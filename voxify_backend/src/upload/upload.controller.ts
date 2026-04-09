import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import multer from 'multer';

@Controller('upload')
export class UploadController {
    constructor(private cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: multer.memoryStorage(),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);

        if (!file) {
            throw new Error('File not received');
        }

        const result = await this.cloudinaryService.uploadFile(file);

        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }
}