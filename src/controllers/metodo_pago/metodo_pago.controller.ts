import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MetodoPagoService } from 'src/services/metodo_pago/metodo_pago.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MetodoPago')
@Controller('metodo-pago')
export class MetodoPagoController {
  constructor(private metodoPagoService: MetodoPagoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear método de pago' })
  @ApiBody({ schema: { example: { metodo: 'Trueque', estado: true } } })
  crear(@Body() body: any) {
    return this.metodoPagoService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.metodoPagoService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.metodoPagoService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar método de pago' })
  @ApiBody({
    schema: { example: { metodo: 'Transferencia Bancaria', estado: true } },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.metodoPagoService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.metodoPagoService.eliminar(id);
  }
}
