import { Injectable } from '@nestjs/common';
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
  ){}
  
  async create(dto: CreateChantDto) {
    return this.chantModel.create(dto);
  }

  async findAll() {
    return this.chantModel.find();
  }

  async findOne(id: string) {
    return this.chantModel.findById(id);
  }

  async update(id: string, dto: UpdateChantDto){
    return this.chantModel.findByIdAndUpdate(id, dto);
  }

  async remove(id: number) {
    return this.chantModel.findByIdAndDelete(id);
  }
}
