import { Test, TestingModule } from '@nestjs/testing';
import { PrestamistaController } from './prestamista.controller';

describe('PrestamistaController', () => {
  let controller: PrestamistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestamistaController],
    }).compile();

    controller = module.get<PrestamistaController>(PrestamistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
