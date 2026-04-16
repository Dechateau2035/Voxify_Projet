import {
  BadRequestException,
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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

type ChantUploadFiles = {
  coverImage?: Express.Multer.File;
  audio?: Express.Multer.File;
  sheetMusic?: Express.Multer.File;
  voices: Array<{
    name: string;
    file: Express.Multer.File;
  }>;
};

@Controller('chants')
export class ChantsController {
  constructor(private readonly chantsService: ChantsService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: multer.memoryStorage(),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Record<string, unknown>,
  ) {
    return this.chantsService.create(
      this.buildCreateDto(body),
      this.parseFiles(files, body),
    );
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
    AnyFilesInterceptor({
      storage: multer.memoryStorage(),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Record<string, unknown>,
  ) {
    return this.chantsService.update(
      id,
      this.buildUpdateDto(body),
      this.parseFiles(files, body),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.chantsService.delete(id);
    return { message: 'Chant + fichiers supprimés proprement' };
  }

  private parseFiles(
    files: Express.Multer.File[] = [],
    body: Record<string, unknown> = {},
  ): ChantUploadFiles {
    const coverImage = this.getSingleFile(files, 'coverImage');
    const audio =
      this.getSingleFile(files, 'audio') ?? this.getSingleFile(files, 'audioUrl');
    const sheetMusic = this.getSingleFile(files, 'sheetMusic');
    const voices = this.extractVoiceFiles(files, body);

    return {
      coverImage,
      audio,
      sheetMusic,
      voices,
    };
  }

  private getSingleFile(
    files: Express.Multer.File[],
    fieldName: string,
  ): Express.Multer.File | undefined {
    return files.find((file) => file.fieldname === fieldName);
  }

  private extractVoiceFiles(
    files: Express.Multer.File[],
    body: Record<string, unknown>,
  ): ChantUploadFiles['voices'] {
    const voices = new Map<number, ChantUploadFiles['voices'][number]>();

    for (const file of files) {
      const fieldMatch = file.fieldname.match(/^voices\[(\d+)\]\[file\]$/);
      if (!fieldMatch) {
        continue;
      }

      const index = Number(fieldMatch[1]);
      const name = this.resolveVoiceName(body, index);

      if (!name) {
        throw new BadRequestException(
          `Missing voice name for uploaded file ${file.originalname}`,
        );
      }

      voices.set(index, {
        name: name.trim(),
        file,
      });
    }

    return Array.from(voices.entries())
      .sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
      .map(([, voice]) => {
        if (!voice.name) {
          throw new BadRequestException('Voice name is required');
        }

        return voice;
      });
  }

  private resolveVoiceName(
    body: Record<string, unknown>,
    index: number,
  ): string | undefined {
    const bracketKey = `voices[${index}][name]`;
    const dotKey = `voices[${index}].name`;

    const directBracketValue = body[bracketKey];
    if (typeof directBracketValue === 'string' && directBracketValue.trim()) {
      return directBracketValue.trim();
    }

    const directDotValue = body[dotKey];
    if (typeof directDotValue === 'string' && directDotValue.trim()) {
      return directDotValue.trim();
    }

    const voices = body.voices;
    if (!voices || typeof voices !== 'object') {
      return undefined;
    }

    if (Array.isArray(voices)) {
      const voice = voices[index];
      if (voice && typeof voice === 'object' && 'name' in voice) {
        const name = voice.name;
        if (typeof name === 'string' && name.trim()) {
          return name.trim();
        }
      }
      return undefined;
    }

    const recordVoices = voices as Record<string, unknown>;
    const indexedVoice = recordVoices[String(index)];
    if (indexedVoice && typeof indexedVoice === 'object' && 'name' in indexedVoice) {
      const name = indexedVoice.name;
      if (typeof name === 'string' && name.trim()) {
        return name.trim();
      }
    }

    return undefined;
  }

  private buildCreateDto(body: Record<string, unknown>): CreateChantDto {
    const title = this.getString(body.title);
    if (!title) {
      throw new BadRequestException('title is required');
    }

    return {
      title,
      category: this.getOptionalString(body.category),
      lyrics: this.getOptionalString(body.lyrics),
      tags: this.getStringArray(body.tags ?? body['tags[]']),
      isPublished: this.getOptionalBoolean(body.isPublished),
      isActive: this.getOptionalBoolean(body.isActive),
      createdBy: this.getOptionalString(body.createdBy),
      updatedBy: this.getOptionalString(body.updatedBy),
    };
  }

  private buildUpdateDto(body: Record<string, unknown>): UpdateChantDto {
    return {
      title: this.getOptionalString(body.title),
      category: this.getOptionalString(body.category),
      lyrics: this.getOptionalString(body.lyrics),
      tags: this.hasValue(body.tags) || this.hasValue(body['tags[]'])
        ? this.getStringArray(body.tags ?? body['tags[]'])
        : undefined,
      isPublished: this.getOptionalBoolean(body.isPublished),
      isActive: this.getOptionalBoolean(body.isActive),
      createdBy: this.getOptionalString(body.createdBy),
      updatedBy: this.getOptionalString(body.updatedBy),
    };
  }

  private getOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  private getString(value: unknown): string | undefined {
    return this.getOptionalString(value);
  }

  private getStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => String(item).trim())
              .filter(Boolean);
          }
        } catch {
          return trimmed
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  }

  private getOptionalBoolean(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }

    return undefined;
  }

  private hasValue(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null;
  }
}
