import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuarioService } from './tipo_usuario.service';

describe('TipoUsuarioService', () => {
  let service: TipoUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoUsuarioService],
    }).compile();

    service = module.get<TipoUsuarioService>(TipoUsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
