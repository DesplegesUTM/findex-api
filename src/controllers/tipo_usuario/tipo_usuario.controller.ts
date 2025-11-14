import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TipoUsuarioService } from 'src/services/tipo_usuario/tipo_usuario.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('TipoUsuario')
@Controller('tipo-usuario')
export class TipoUsuarioController {
  constructor(private tipoUsuarioService: TipoUsuarioService) {}
  @Post()
  @ApiOperation({ summary: 'Crear tipo de usuario' })
  @ApiBody({ schema: { example: { tipo: 'Administrador', estado: true } } })
  crear(@Body() body: any) {
    return this.tipoUsuarioService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.tipoUsuarioService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.tipoUsuarioService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar tipo de usuario' })
  @ApiBody({ schema: { example: { tipo: 'Administrador', estado: true } } })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.tipoUsuarioService.actualizar(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.tipoUsuarioService.eliminar(id);
  }
}
