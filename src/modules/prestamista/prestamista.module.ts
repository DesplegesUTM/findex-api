import { Module } from '@nestjs/common';
import { PrestamistaService } from 'src/services/prestamista/prestamista.service';
import { DatabaseModule } from 'src/database/database.module';
import { PrestamistaController } from 'src/controllers/prestamista/prestamista.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PrestamistaController],
  providers: [PrestamistaService],
  exports: [PrestamistaService],
})
export class PrestamistaModule {}
