import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuarioController } from './tipo_usuario.controller';

describe('TipoUsuarioController', () => {
  let controller: TipoUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoUsuarioController],
    }).compile();

    controller = module.get<TipoUsuarioController>(TipoUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
