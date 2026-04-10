import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
  ) { }

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
    )
  )
  async create(
    @UploadedFiles() files: {
      coverImage?: Express.Multer.File[];
      audioUrl?: Express.Multer.File[];
      soprano?: Express.Multer.File[];
      alto?: Express.Multer.File[];
      tenor?: Express.Multer.File[];
      bass?: Express.Multer.File[];
    },
    @Body() dto: CreateChantDto
  ) {
    const upload = async (file?: Express.Multer.File) => {
      if (!file) return null;
      const res = await this.cloudinaryService.uploadFile(file);
      return res.secure_url;
    }

    const coverImage = await upload(files.coverImage?.[0]);
    const audioUrl = await upload(files.audioUrl?.[0]);

    const voices = {
      soprano: await upload(files.soprano?.[0]),
      alto: await upload(files.alto?.[0]),
      tenor: await upload(files.tenor?.[0]),
      bass: await upload(files.bass?.[0]),
    }

    const dataToSave = {
      ...dto,
      coverImage,
      audioUrl,
      voices
    };

    return this.chantsService.create(dataToSave);
  }

  @Post('/de')
  creater(@Body() createChantDto: CreateChantDto) {
    return this.chantsService.create(createChantDto);
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
  update(@Param('id') id: string, @Body() dto: UpdateChantDto) {
    return this.chantsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chantsService.delete(id);
  }
}
