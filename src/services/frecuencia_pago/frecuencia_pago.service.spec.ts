import { Test, TestingModule } from '@nestjs/testing';
import { FrecuenciaPagoService } from './frecuencia_pago.service';

describe('FrecuenciaPagoService', () => {
  let service: FrecuenciaPagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrecuenciaPagoService],
    }).compile();

    service = module.get<FrecuenciaPagoService>(FrecuenciaPagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
