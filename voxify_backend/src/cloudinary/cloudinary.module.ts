import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { UploadController } from "src/upload/upload.controller";
import { CloudinaryService } from "./cloudinary.service";

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})

export class CLoudinaryModule {}