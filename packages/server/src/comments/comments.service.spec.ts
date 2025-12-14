import { Test, TestingModule } from '@nestjs/testing';
import { CommantsService } from './comments.service';

describe('CommantsService', () => {
  let service: CommantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommantsService],
    }).compile();

    service = module.get<CommantsService>(CommantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
