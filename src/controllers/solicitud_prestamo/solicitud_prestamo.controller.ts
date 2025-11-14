import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SolicitudPrestamoService } from 'src/services/solicitud_prestamo/solicitud_prestamo.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorador';

@Controller('solicitud-prestamo')
export class SolicitudPrestamoController {
  constructor(private readonly service: SolicitudPrestamoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2)
  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get('oferta/:id_oferta')
  listarPorOferta(@Param('id_oferta') id_oferta: number) {
    return this.service.listarPorOferta(Number(id_oferta));
  }

  // listar todas las solicitudes de todas las ofertas de un prestamista
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get('prestamista/:id_prestamista')
  listarPorPrestamista(@Param('id_prestamista') id_prestamista: number) {
    return this.service.listarPorPrestamista(Number(id_prestamista));
  }

  // verificar rápidamente si un prestatario ya aplicó a una oferta
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2)
  @Get('ya-aplico/:id_oferta/:id_prestatario')
  yaAplico(
    @Param('id_oferta') id_oferta: number,
    @Param('id_prestatario') id_prestatario: number,
  ) {
    return this.service.yaAplico(Number(id_oferta), Number(id_prestatario));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Post(':id/aceptar')
  aceptar(@Param('id') id: number) {
    return this.service.aceptar(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Post(':id/rechazar')
  rechazar(@Param('id') id: number) {
    return this.service.rechazar(Number(id));
  }
}
