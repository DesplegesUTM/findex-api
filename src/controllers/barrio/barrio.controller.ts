import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BarrioService } from 'src/services/barrio/barrio.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Barrio')
@Controller('barrio')
export class BarrioController {
  constructor(private barrioService: BarrioService) {}

  @Get('ciudad/:id')
  barrioPorCiudad(@Param('id') id: number) {
    return this.barrioService.barrioPorCiudad(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear barrio' })
  @ApiBody({
    schema: {
      example: { id_ciudad: 3, nombre_barrio: 'Centro', estado: true },
    },
  })
  crear(@Body() body: any) {
    return this.barrioService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.barrioService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.barrioService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar barrio' })
  @ApiBody({
    schema: {
      example: { id_ciudad: 3, nombre_barrio: 'Centro', estado: true },
    },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.barrioService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.barrioService.eliminar(id);
  }
}
