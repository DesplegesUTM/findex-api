import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { DireccionService } from 'src/services/direccion/direccion.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Direccion')
@Controller('direccion')
export class DireccionController {
  constructor(private direccionService: DireccionService) {}
  @Post()
  @ApiOperation({ summary: 'Crear dirección' })
  @ApiBody({
    schema: {
      example: {
        id_barrio: 1,
        calle1: 'Av. Siempre Viva',
        calle2: 'Calle Falsa',
        estado: true,
      },
    },
  })
  crear(@Body() body: any) {
    return this.direccionService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.direccionService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.direccionService.obtenerPorId(id);
  }

  //endpoint para obtener dirección completa con ciudad y barrio
  @Get('completa/:id')
  obtenerDireccionCompleta(@Param('id') id: number) {
    return this.direccionService.obtenerDireccionCompleta(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar dirección' })
  @ApiBody({
    schema: {
      example: {
        calle1: 'Av. Siempre Viva',
        calle2: 'Calle Falsa',
        estado: true,
      },
    },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.direccionService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.direccionService.eliminar(id);
  }

  //endpoint para obtener todas las calles1 disponibles
  @Get('calles1/all')
  obtenerCalles1() {
    return this.direccionService.obtenerCalles1();
  }

  //endpoint para obtener todas las calles2 disponibles
  @Get('calles2/all')
  obtenerCalles2() {
    return this.direccionService.obtenerCalles2();
  }

  //endpoint para obtener direcciones por barrio
  @Get('barrio/:id')
  obtenerDireccionesPorBarrio(@Param('id') id: number) {
    return this.direccionService.obtenerDireccionesPorBarrio(id);
  }
}
