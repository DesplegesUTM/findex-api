import { Test, TestingModule } from '@nestjs/testing';
import { PrestatarioController } from './prestatario.controller';

describe('PrestatarioController', () => {
  let controller: PrestatarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestatarioController],
    }).compile();

    controller = module.get<PrestatarioController>(PrestatarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
