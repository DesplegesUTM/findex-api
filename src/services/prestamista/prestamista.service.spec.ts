import { Test, TestingModule } from '@nestjs/testing';
import { PrestamistaService } from './prestamista.service';

describe('PrestamistaService', () => {
  let service: PrestamistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestamistaService],
    }).compile();

    service = module.get<PrestamistaService>(PrestamistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
