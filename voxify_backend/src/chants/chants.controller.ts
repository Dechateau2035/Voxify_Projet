import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChantsService } from './chants.service';
import { CreateChantDto } from './dto/create-chant.dto';
import { UpdateChantDto } from './dto/update-chant.dto';

@Controller('chants')
export class ChantsController {
  constructor(private readonly chantsService: ChantsService) { }

  @Post()
  create(@Body() createChantDto: CreateChantDto) {
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
