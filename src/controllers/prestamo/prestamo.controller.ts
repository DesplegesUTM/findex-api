import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorador';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { PrestamoService } from 'src/services/prestamo/prestamo.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrestamoCreateDto } from 'src/dto/prestamo.dto';

@ApiTags('Prestamo')
@ApiBearerAuth('bearer')
@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}
  //end point obterner por Prestamista
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get('prestamos-por-prestamista/:id')
  obtenerPorPrestamista(@Param('id') id: number) {
    return this.prestamoService.obtenerPorPrestamista(id);
  }

  //end point obtener prestamo para el prestatario
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2)
  @Get('prestamos-por-prestatario/:id')
  obtenerPorPrestatario(@Param('id') id: number) {
    return this.prestamoService.obtenerPorPrestatario(id);
  }

  // endpoint crear prestamo
  @Post()
  @ApiOperation({ summary: 'Crear préstamo (origina y descuenta capital)' })
  @ApiBody({
    type: PrestamoCreateDto,
    examples: {
      ejemplo: {
        value: {
          id_oferta: 1,
          id_prestatario: 1,
          fecha_inicio: '2023-01-01',
          fecha_fin: '2023-01-01',
          estado: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Préstamo creado' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o capital insuficiente',
  })
  crear(@Body() body: any) {
    return this.prestamoService.crear(body);
  }

  // endpoint obtener todos
  @Get()
  @ApiOperation({ summary: 'Listar préstamos' })
  obtenerTodos() {
    return this.prestamoService.obtenerTodos();
  }

  // Obtener el préstamo del prestatario autenticado para una oferta específica
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2)
  @Get('mi-prestamo-por-oferta/:id_oferta')
  @ApiOperation({ summary: 'Obtener mi préstamo (prestatario) por oferta' })
  obtenerMiPrestamoPorOferta(
    @Param('id_oferta') id_oferta: number,
    @Req() req: any,
  ) {
    const id_usuario = Number(req.user?.sub);
    return this.prestamoService.obtenerPorOfertaYPrestatario(
      id_oferta,
      id_usuario,
    );
  }

  // endpoint obtener por ID

  @Get(':id')
  obtenerPorID(@Param('id') id: number) {
    return this.prestamoService.obtenerPorId(id);
  }

  // endpoint actualizar prestamo
  @Put(':id')
  actualizarPrestamo(@Param('id') id: number, @Body() body: any) {
    return this.prestamoService.actualizar(id, body);
  }

  // eliminar el prestamo
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.prestamoService.eliminar(id);
  }
}
