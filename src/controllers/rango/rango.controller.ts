import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RangoService } from 'src/services/rango/rango.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rango')
@Controller('rango')
export class RangoController {
  constructor(private rangoService: RangoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear rango' })
  @ApiBody({ schema: { example: { rango: 'Oro', estado: true } } })
  crear(@Body() body: any) {
    return this.rangoService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.rangoService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.rangoService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar rango' })
  @ApiBody({ schema: { example: { rango: 'Oro', estado: true } } })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.rangoService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.rangoService.eliminar(id);
  }
}
