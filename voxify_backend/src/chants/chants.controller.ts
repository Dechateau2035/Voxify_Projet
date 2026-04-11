import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChantsService } from './chants.service';
import { CreateChantDto } from './dto/create-chant.dto';
import { UpdateChantDto } from './dto/update-chant.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('chants')
export class ChantsController {
  constructor(
    private readonly chantsService: ChantsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'audioUrl', maxCount: 1 },
        { name: 'soprano', maxCount: 1 },
        { name: 'alto', maxCount: 1 },
        { name: 'tenor', maxCount: 1 },
        { name: 'bass', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      audioUrl?: Express.Multer.File[];
      soprano?: Express.Multer.File[];
      alto?: Express.Multer.File[];
      tenor?: Express.Multer.File[];
      bass?: Express.Multer.File[];
    },
    @Body() dto: CreateChantDto,
  ) {
    const upload = async (file?: Express.Multer.File) => {
      if (!file) return null;
      const res = await this.cloudinaryService.uploadFile(file);
      return {
        url: res.secure_url,
        public_id: res.public_id,
      };
    };

    const coverImage = await upload(files.coverImage?.[0]);
    const audioUrl = await upload(files.audioUrl?.[0]);

    const voices = {
      soprano: await upload(files.soprano?.[0]),
      alto: await upload(files.alto?.[0]),
      tenor: await upload(files.tenor?.[0]),
      bass: await upload(files.bass?.[0]),
    };

    const dataToSave = {
      ...dto,
      coverImage,
      audioUrl,
      voices,
    };

    console.log(`Data created: ${dataToSave}`);

    return this.chantsService.create(dataToSave);
  }

  @Get()
  findAll(@Query() query) {
    return this.chantsService.findAll(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.chantsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chantsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'audioUrl', maxCount: 1 },
        { name: 'soprano', maxCount: 1 },
        { name: 'alto', maxCount: 1 },
        { name: 'tenor', maxCount: 1 },
        { name: 'bass', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Body() dto: UpdateChantDto,
  ) {
    const chant = await this.chantsService.findOne(id);

    const upload = async (file?: Express.Multer.File) => {
      if (!file) return null;
      const res = await this.cloudinaryService.uploadFile(file);
      return {
        url: res.secure_url,
        public_id: res.public_id,
      };
    };

    const deleteFile = async (public_id?: string) => {
      if (public_id) {
        await this.cloudinaryService.deleteFile(public_id);
      }
    };

    let coverImage: { url: string; public_id: string } | null =
      chant.coverImage!;
    if (files.coverImage?.[0]) {
      await deleteFile(chant.coverImage?.public_id);
      coverImage = await upload(files.coverImage[0]);
    }

    let audioUrl: { url: string; public_id: string } | null = chant.audioUrl!;
    if (files.audioUrl?.[0]) {
      await deleteFile(chant.audioUrl?.public_id);
      audioUrl = await upload(files.audioUrl[0]);
    }

    const voices = { ...chant.voices };

    for (const voice of ['soprano', 'alto', 'tenor', 'bass']) {
      if (files[voice]?.[0]) {
        await deleteFile(voices?.[voice]?.public_id);
        voices[voice] = await upload(files[voice][0]);
      }
    }

    const updateData = {
      ...dto,
      coverImage,
      audioUrl,
      voices,
    };

    return this.chantsService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const chant = await this.chantsService.findOne(id);

    const deleteFile = async (file?: { public_id: string }) => {
      if (file?.public_id) {
        await this.cloudinaryService.deleteFile(file.public_id);
      }
    };

    await deleteFile(chant.coverImage);
    await deleteFile(chant.audioUrl);

    for (const voice of ['soprano', 'alto', 'tenor', 'bass']) {
      await deleteFile(chant.voices?.[voice]);
    }

    await this.chantsService.delete(id);

    return { message: 'Chant + fichiers supprimés proprement' };
  }
}
