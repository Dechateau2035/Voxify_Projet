import { Module } from '@nestjs/common';
import { ChantsService } from './chants.service';
import { ChantsController } from './chants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chant, ChantSchema } from './entities/chant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chant.name, schema: ChantSchema }
    ])
  ],
  controllers: [ChantsController],
  providers: [ChantsService],
})
export class ChantsModule {}
