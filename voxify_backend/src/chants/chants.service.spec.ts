import { Test, TestingModule } from '@nestjs/testing';
import { ChantsService } from './chants.service';

describe('ChantsService', () => {
  let service: ChantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChantsService],
    }).compile();

    service = module.get<ChantsService>(ChantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
