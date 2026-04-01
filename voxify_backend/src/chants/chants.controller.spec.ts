import { Test, TestingModule } from '@nestjs/testing';
import { ChantsController } from './chants.controller';
import { ChantsService } from './chants.service';

describe('ChantsController', () => {
  let controller: ChantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChantsController],
      providers: [ChantsService],
    }).compile();

    controller = module.get<ChantsController>(ChantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
