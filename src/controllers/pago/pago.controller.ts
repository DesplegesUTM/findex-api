import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagoCreateDto } from 'src/dto/pago.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PagoService } from 'src/services/pago/pago.service';

@ApiTags('Pago')
@ApiBearerAuth('bearer')
@Controller('pago')
export class PagoController {
  constructor(private pagoService: PagoService) {}

  /**
   * Controlador para manejar los pagos de los prestatarios
   * @param PagoService
   * @returns los pagos de un solo prestatario
   * @param id - ID del prestatario
   */
  @Get('pagos-prestatario/:id')
  obtenerPagosPorPrestatario(@Param('id') id: number) {
    return this.pagoService.obtenerPagosPorPrestatario(id);
  }

  /**
   * Controlador para manejar los pagos noramales de los prestatarios
   * @param PagoService
   * @returns
   */

  @Post()
  @UseInterceptors(FileInterceptor('comprobante'))
  @ApiOperation({ summary: 'Crear pago con comprobante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: PagoCreateDto,
    description:
      'Enviar como multipart/form-data con campo comprobante (archivo)',
    examples: {
      ejemplo: {
        value: {
          id_prestamo: 1,
          fecha_pago: '2023-02-01',
          monto_pagado: 100,
          id_metodo: 1,
          estado: true,
          // comprobante: <archivo>
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Pago registrado' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  async crear(@UploadedFile() file: any, @Body() body: any) {
    // Logging para depuración
    console.log('PagoController.crear - body:', body);
    console.log('PagoController.crear - file:', file);
    // Guardar ruta del comprobante
    if (file) {
      body.comprobante_url = `/uploads/${file.filename}`;
    }
    // Convertir campos a tipos correctos
    if (body.id_prestamo) body.id_prestamo = Number(body.id_prestamo);
    if (body.monto_pagado) body.monto_pagado = Number(body.monto_pagado);
    if (body.id_metodo) body.id_metodo = Number(body.id_metodo);
    body.estado = body.estado === 'true' || body.estado === true;
    try {
      const result = await this.pagoService.crear(body);
      return result;
    } catch (error) {
      console.error('Error en PagoController.crear:', error);
      throw error;
    }
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.pagoService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.pagoService.obtenerPorId(id);
  }

  /**
   * Endpoint para obtener pagos por id_oferta
   */
  @Get('pagos-oferta/:id_oferta')
  obtenerPagosPorOferta(@Param('id_oferta') id_oferta: number) {
    return this.pagoService.obtenerPagosPorOferta(id_oferta);
  }
  /**
   * Endpoint para obtener pagos por id_prestamo
   */
  @Get('pagos-prestamo/:id')
  obtenerPagosPorPrestamo(@Param('id') id: number) {
    return this.pagoService.obtenerPagosPorPrestamo(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.pagoService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.pagoService.eliminar(id);
  }
}
