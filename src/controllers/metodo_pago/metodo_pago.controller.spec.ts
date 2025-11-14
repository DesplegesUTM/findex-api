import { Test, TestingModule } from '@nestjs/testing';
import { MetodoPagoController } from './metodo_pago.controller';

describe('MetodoPagoController', () => {
  let controller: MetodoPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodoPagoController],
    }).compile();

    controller = module.get<MetodoPagoController>(MetodoPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
