import { Test, TestingModule } from '@nestjs/testing';
import { BarrioController } from './barrio.controller';

describe('BarrioController', () => {
  let controller: BarrioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarrioController],
    }).compile();

    controller = module.get<BarrioController>(BarrioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
