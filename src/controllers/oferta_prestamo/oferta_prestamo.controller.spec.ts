import { Test, TestingModule } from '@nestjs/testing';
import { OfertaPrestamoController } from './oferta_prestamo.controller';

describe('OfertaPrestamoController', () => {
  let controller: OfertaPrestamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfertaPrestamoController],
    }).compile();

    controller = module.get<OfertaPrestamoController>(OfertaPrestamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
