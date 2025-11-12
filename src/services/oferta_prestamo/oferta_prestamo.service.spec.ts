import { Test, TestingModule } from '@nestjs/testing';
import { OfertaPrestamoService } from './oferta_prestamo.service';

describe('OfertaPrestamoService', () => {
  let service: OfertaPrestamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfertaPrestamoService],
    }).compile();

    service = module.get<OfertaPrestamoService>(OfertaPrestamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
