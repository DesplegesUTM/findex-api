import { Test, TestingModule } from '@nestjs/testing';
import { PrestatarioService } from './prestatario.service';

describe('PrestatarioService', () => {
  let service: PrestatarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestatarioService],
    }).compile();

    service = module.get<PrestatarioService>(PrestatarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
