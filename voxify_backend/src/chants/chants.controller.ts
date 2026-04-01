import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChantsService } from './chants.service';
import { CreateChantDto } from './dto/create-chant.dto';
import { UpdateChantDto } from './dto/update-chant.dto';

@Controller('chants')
export class ChantsController {
  constructor(private readonly chantsService: ChantsService) {}

  @Post()
  create(@Body() createChantDto: CreateChantDto) {
    return this.chantsService.create(createChantDto);
  }

  @Get()
  findAll() {
    return this.chantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChantDto: UpdateChantDto) {
    return this.chantsService.update(id, updateChantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chantsService.remove(+id);
  }
}
