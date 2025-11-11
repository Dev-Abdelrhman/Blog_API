import { Test, TestingModule } from '@nestjs/testing';
import { CommantsController } from './comments.controller';

describe('CommantsController', () => {
  let controller: CommantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommantsController],
    }).compile();

    controller = module.get<CommantsController>(CommantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
