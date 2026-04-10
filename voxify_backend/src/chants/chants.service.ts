import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChantDto } from './dto/create-chant.dto';
import { UpdateChantDto } from './dto/update-chant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chant, ChantDocument } from './entities/chant.entity';
import { Model } from 'mongoose';

@Injectable()
export class ChantsService {
  constructor(
    @InjectModel(Chant.name)
    private chantModel: Model<ChantDocument>,
  ) { }

  async create(dto: CreateChantDto) {
    
    const slug = dto.title.toLowerCase().trim().replace(/ /g, '-');
    return this.chantModel.create({ ...dto, slug });
  }

  async findAll(query: any) {
    const filter: any = {};

    if (query.category) filter.category = query.category;
    if (query.tag) filter.tags = { $in: [query.tag] };
    if (query.isPublished) filter.isPublished = query.isPublished === 'true';

    return this.chantModel.find(filter).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const chant = await this.chantModel.findById(id);
    if (!chant) throw new NotFoundException('Chant not found');
    return chant;
  }

  async findBySlug(slug: string) {
    return this.chantModel.findOne({ slug });
  }

  async update(id: string, dto: UpdateChantDto) {
    const chant = await this.chantModel.findByIdAndUpdate(id, dto, { new: true });
    if (!chant) throw new NotFoundException('Chant not found');
    return chant;
  }

  async delete(id: string) {
    const chant = await this.chantModel.findByIdAndDelete(id);
    if (!chant) throw new NotFoundException('Chant not found');
    return { message: 'Deleted successfully' };
  }
}
