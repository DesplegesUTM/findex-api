import { Module } from '@nestjs/common';
import { PrestatarioService } from 'src/services/prestatario/prestatario.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PrestatarioService],
  exports: [PrestatarioService],
})
export class PrestatarioModule {}
