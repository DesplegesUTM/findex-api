import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FrecuenciaPagoService } from 'src/services/frecuencia_pago/frecuencia_pago.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FrecuenciaPago')
@Controller('frecuencia-pago')
export class FrecuenciaPagoController {
  constructor(private frecuenciaPagoService: FrecuenciaPagoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear frecuencia de pago' })
  @ApiBody({
    schema: { example: { frecuencia_pago: 'Mensual', estado: true } },
  })
  crear(@Body() body: any) {
    return this.frecuenciaPagoService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.frecuenciaPagoService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.frecuenciaPagoService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar frecuencia de pago' })
  @ApiBody({
    schema: { example: { frecuencia_pago: 'Mensual', estado: true } },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.frecuenciaPagoService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.frecuenciaPagoService.eliminar(id);
  }
}
