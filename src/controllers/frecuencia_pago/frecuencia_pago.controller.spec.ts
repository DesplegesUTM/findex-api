import { Test, TestingModule } from '@nestjs/testing';
import { FrecuenciaPagoController } from './frecuencia_pago.controller';

describe('FrecuenciaPagoController', () => {
  let controller: FrecuenciaPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrecuenciaPagoController],
    }).compile();

    controller = module.get<FrecuenciaPagoController>(FrecuenciaPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
