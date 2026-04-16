import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChantDto } from './dto/create-chant.dto';
import { UpdateChantDto } from './dto/update-chant.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Chant,
  ChantDocument,
  ChantVoice,
  Media,
} from './entities/chant.entity';
import { Error as MongooseError, Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

type ChantFilePayload = {
  coverImage?: Express.Multer.File;
  audio?: Express.Multer.File;
  sheetMusic?: Express.Multer.File;
  voices: Array<{
    name: string;
    file: Express.Multer.File;
  }>;
};

@Injectable()
export class ChantsService {
  constructor(
    @InjectModel(Chant.name)
    private chantModel: Model<ChantDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateChantDto, files: ChantFilePayload) {
    try {
      const [coverImage, audio, sheetMusic, voices] = await Promise.all([
        this.uploadOptionalFile(files.coverImage),
        this.uploadOptionalFile(files.audio),
        this.uploadOptionalFile(files.sheetMusic),
        this.uploadVoiceFiles(files.voices),
      ]);

      const title = dto.title.trim();

      return await this.chantModel.create({
        ...dto,
        title,
        slug: this.generateSlug(title),
        normalizedTitle: this.normalizeTitle(title),
        coverImage,
        audio,
        sheetMusic,
        voices,
        tags: this.normalizeTags(dto.tags),
        createdBy: this.toObjectId(dto.createdBy),
        updatedBy: this.toObjectId(dto.updatedBy),
      });
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  async findAll(query: any) {
    const filter: any = {};

    if (query.category) filter.category = query.category;
    if (query.tag) filter.tags = { $in: [query.tag] };
    if (query.isPublished) filter.isPublished = query.isPublished === 'true';
    if (query.isActive) filter.isActive = query.isActive === 'true';
    if (query.search) filter.$text = { $search: String(query.search).trim() };

    const mongoQuery = this.chantModel.find(filter).sort({ createdAt: -1 });

    if (filter.$text) {
      mongoQuery.select({ score: { $meta: 'textScore' } });
      mongoQuery.sort({ score: { $meta: 'textScore' } });
    }

    return mongoQuery;
  }

  async findOne(id: string) {
    const chant = await this.chantModel.findById(id);
    if (!chant) throw new NotFoundException('Chant not found');
    return chant;
  }

  async findBySlug(slug: string) {
    const chant = await this.chantModel.findOne({ slug });
    if (!chant) throw new NotFoundException('Chant not found');
    return chant;
  }

  async update(id: string, dto: UpdateChantDto, files: ChantFilePayload) {
    const chant = await this.findOne(id);

    const nextTitle = dto.title?.trim() ?? chant.title;
    const coverImage = await this.replaceMedia(chant.coverImage, files.coverImage);
    const audio = await this.replaceMedia(chant.audio, files.audio);
    const sheetMusic = await this.replaceMedia(
      chant.sheetMusic,
      files.sheetMusic,
    );
    const voices = await this.mergeVoices(chant.voices, files.voices);

    const updatePayload: Partial<Chant> = {
      title: nextTitle,
      normalizedTitle: this.normalizeTitle(nextTitle),
      coverImage,
      audio,
      sheetMusic,
      voices,
      category: dto.category,
      lyrics: dto.lyrics,
      isPublished: dto.isPublished,
      isActive: dto.isActive,
      createdBy: this.toObjectId(dto.createdBy),
      updatedBy: this.toObjectId(dto.updatedBy),
    };

    if (dto.title) {
      updatePayload.slug = this.generateSlug(nextTitle);
    }

    if (dto.tags) {
      updatePayload.tags = this.normalizeTags(dto.tags);
    }

    try {
      const updated = await this.chantModel.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new NotFoundException('Chant not found');
      }

      return updated;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  async delete(id: string) {
    const chant = await this.findOne(id);

    await this.deleteMediaCollection([
      chant.coverImage,
      chant.audio,
      chant.sheetMusic,
      ...chant.voices.map((voice) => voice.audio),
    ]);

    await this.chantModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }

  private async uploadOptionalFile(
    file?: Express.Multer.File,
  ): Promise<Media | null> {
    if (!file) {
      return null;
    }

    return this.cloudinaryService.uploadFile(file);
  }

  private async uploadVoiceFiles(
    voices: ChantFilePayload['voices'],
  ): Promise<ChantVoice[]> {
    return Promise.all(
      voices.map(async ({ name, file }) => ({
        name,
        audio: await this.cloudinaryService.uploadFile(file),
      })),
    );
  }

  private async replaceMedia(
    currentMedia: Media | null | undefined,
    nextFile?: Express.Multer.File,
  ): Promise<Media | null> {
    if (!nextFile) {
      return currentMedia ?? null;
    }

    const uploadedMedia = await this.cloudinaryService.uploadFile(nextFile);

    if (currentMedia?.public_id) {
      await this.cloudinaryService.deleteFile(currentMedia.public_id);
    }

    return uploadedMedia;
  }

  private async mergeVoices(
    currentVoices: ChantVoice[] = [],
    nextVoices: ChantFilePayload['voices'],
  ): Promise<ChantVoice[]> {
    if (!nextVoices.length) {
      return currentVoices;
    }

    const voiceMap = new Map(
      currentVoices.map((voice) => [this.normalizeTitle(voice.name), voice]),
    );

    for (const { name, file } of nextVoices) {
      const key = this.normalizeTitle(name);
      const existingVoice = voiceMap.get(key);
      const uploadedAudio = await this.cloudinaryService.uploadFile(file);

      if (existingVoice?.audio?.public_id) {
        await this.cloudinaryService.deleteFile(existingVoice.audio.public_id);
      }

      voiceMap.set(key, {
        name: name.trim(),
        audio: uploadedAudio,
      });
    }

    return Array.from(voiceMap.values());
  }

  private async deleteMediaCollection(
    mediaItems: Array<Media | null | undefined>,
  ): Promise<void> {
    const publicIds = mediaItems
      .map((item) => item?.public_id)
      .filter((publicId): publicId is string => Boolean(publicId));

    if (!publicIds.length) {
      return;
    }

    const deletionResults = await Promise.allSettled(
      publicIds.map((publicId) => this.cloudinaryService.deleteFile(publicId)),
    );

    const rejectedDeletion = deletionResults.find(
      (result) => result.status === 'rejected',
    );

    if (rejectedDeletion?.status === 'rejected') {
      throw new InternalServerErrorException(
        'Unable to delete chant media from storage',
      );
    }
  }

  private normalizeTitle(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  private generateSlug(value: string): string {
    return this.normalizeTitle(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private normalizeTags(tags?: string[]): string[] {
    if (!tags?.length) {
      return [];
    }

    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
  }

  private toObjectId(value?: string): Types.ObjectId | undefined {
    if (!value) {
      return undefined;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid ObjectId value: ${value}`);
    }

    return new Types.ObjectId(value);
  }

  private handlePersistenceError(error: unknown): never {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException('A chant with the same slug already exists');
    }

    if (error instanceof MongooseError.ValidationError) {
      throw error;
    }

    throw error;
  }
}
