import { Module } from '@nestjs/common';
import { UsuarioController } from 'src/controllers/usuario/usuario.controller';
import { DatabaseService } from 'src/database/database.service';
import { UsuarioService } from 'src/services/usuario/usuario.service';
import { PrestamistaModule } from '../prestamista/prestamista.module';
import { PrestatarioModule } from '../prestatario/prestatario.module';
import { PrestatarioService } from 'src/services/prestatario/prestatario.service';
import { PrestamistaService } from 'src/services/prestamista/prestamista.service';

@Module({
  imports: [PrestamistaModule, PrestatarioModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    DatabaseService,
    PrestamistaService,
    PrestatarioService,
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
