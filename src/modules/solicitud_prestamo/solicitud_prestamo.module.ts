import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SolicitudPrestamoService } from 'src/services/solicitud_prestamo/solicitud_prestamo.service';
import { SolicitudPrestamoController } from 'src/controllers/solicitud_prestamo/solicitud_prestamo.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SolicitudPrestamoService],
  controllers: [SolicitudPrestamoController],
})
export class SolicitudPrestamoModule {}
