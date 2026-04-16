import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Media } from 'src/chants/entities/chant.entity';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<Media> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'uploads',
        },
        (error, result) => {
          if (error) return reject(error);
          const response = result as UploadApiResponse;
          resolve({
            url: response.secure_url,
            public_id: response.public_id,
            duration: response.duration,
            format: response.format,
          });
        },
      );

      upload.end(file.buffer);
    });
  }

  async deleteFile(public_id: string) {
    return cloudinary.uploader.destroy(public_id, {
      resource_type: 'auto',
      invalidate: true,
    });
  }
}
