import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { Roles } from 'src/common/decorators/roles.decorador';
import { OfertaPrestamoService } from 'src/services/oferta_prestamo/oferta_prestamo.service';
import { RolesGuard } from '../guards/roles.guard';

@Controller('oferta-prestamo')
export class OfertaPrestamoController {
  constructor(private readonly ofertaService: OfertaPrestamoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1) // Solo prestamistas
  @Post()
  crear(@Body() body: any) {
    return this.ofertaService.crear(body);
  }
}
