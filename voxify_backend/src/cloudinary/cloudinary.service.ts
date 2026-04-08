import { Injectable, UploadedFile } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'uploads',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                },
            );

            upload.end(file.buffer);
        });
    }
}