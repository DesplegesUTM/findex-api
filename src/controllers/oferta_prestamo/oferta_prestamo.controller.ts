import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorador';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OfertaPrestamoService } from 'src/services/oferta_prestamo/oferta_prestamo.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  OfertaPrestamoCreateDto,
  OfertaPrestamoUpdateDto,
} from 'src/dto/oferta_prestamo.dto';

@ApiTags('OfertaPrestamo')
@ApiBearerAuth('bearer')
@Controller('oferta-prestamo')
export class OfertaPrestamoController {
  constructor(private readonly ofertaPrestamoService: OfertaPrestamoService) {}

  //validar codigo de oferta de prestamo

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get('validar-codigo/:codigo')
  validarCodigo(@Param('codigo') codigo: any) {
    return this.ofertaPrestamoService.validarCodigo(codigo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3, 2, 1)
  @Get('obtener-prestamos')
  obtenerPrestamos() {
    return this.ofertaPrestamoService.obtenerPrestamos();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get('obtener-prestamo/:id')
  obtenerPrestamo(@Param('id') id: number) {
    return this.ofertaPrestamoService.obtenerPrestamo(id);
  }

  // ofertas de un prestamista (para gestionar solicitudes)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get('mis-ofertas/:id_prestamista')
  obtenerPorPrestamista(@Param('id_prestamista') id_prestamista: number) {
    return this.ofertaPrestamoService.obtenerPorPrestamista(
      Number(id_prestamista),
    );
  }

  // ENDPOINTS PARA LA TABLA OFERTA_PRESTAMO MUESTRA SOLO LOS ATRIBUTOS DE LAS TABLAS QUE SE NECESITAN PARA LA OFERTA DE PRESTAMO, NO MUESTRA LOS ATRIBUTOS DE LAS TABLAS RELACIONADAS, SOLO LOS QUE SON NECESARIOS PARA LA OFERTA DE PRESTAMO
  // ESTAS NO SE VAN A USAR EN LA APLICACION, SOLO SE VA A USAR PARA EL DESARROLLO PARA PODER INGRESRA DATOS FACILEMNTE PARA PRUEVAS
  //#########################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################

  //
  //crear

  //endpoint para crear una oferta de prestamo
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Post()
  @ApiOperation({ summary: 'Crear oferta de préstamo' })
  @ApiBody({
    type: OfertaPrestamoCreateDto,
    examples: {
      ejemplo: {
        value: {
          id_prestamista: 21,
          codigo_oferta: 'OFERTA126',
          monto: 1000,
          tasa_interes: 10,
          id_frecuencia: 1,
          nro_cuotas: 12,
          monto_cuota: 100,
          fecha_publicacion: '2023-01-01',
          estado: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Oferta creada' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o monto excede capital',
  })
  crear(@Body() body: any) {
    return this.ofertaPrestamoService.crear(body);
  }

  //endpoint para obtener todos los prestamos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  @Get()
  obtenerTodos() {
    return this.ofertaPrestamoService.obtenerTodos();
  }

  //endpoint para obtener un prestamos por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.ofertaPrestamoService.obtenerPorId(id);
  }

  //endpoint para actualizar un prestamos por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar oferta de préstamo' })
  @ApiBody({
    type: OfertaPrestamoUpdateDto,
    examples: {
      ejemplo: {
        value: {
          monto: 1000,
          tasa_interes: 10,
          id_frecuencia: 1,
          nro_cuotas: 12,
          monto_cuota: 100,
          estado: true,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Oferta actualizada' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o monto excede capital',
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.ofertaPrestamoService.actualizar(id, body);
  }

  //endpoint para eliminar un prestamos por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.ofertaPrestamoService.eliminar(id);
  }
}
