import { Test, TestingModule } from '@nestjs/testing';
import { BarrioService } from './barrio.service';

describe('BarrioService', () => {
  let service: BarrioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarrioService],
    }).compile();

    service = module.get<BarrioService>(BarrioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
