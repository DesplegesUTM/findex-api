import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorador';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { CiudadService } from 'src/services/ciudad/ciudad.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ciudad')
@Controller('ciudad')
export class CiudadController {
  constructor(private ciudadService: CiudadService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ciudad' })
  @ApiBody({
    schema: { example: { nombre_ciudad: 'Pedernales', estado: true } },
  })
  crear(@Body() body: any) {
    return this.ciudadService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get()
  obtenerTodos() {
    return this.ciudadService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.ciudadService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar ciudad' })
  @ApiBody({
    schema: { example: { nombre_ciudad: 'Pedernales', estado: true } },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.ciudadService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.ciudadService.eliminar(id);
  }
}
