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
import { Roles } from 'src/common/decorators/roles.decorador';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsuarioService } from 'src/services/usuario/usuario.service';
import { PrestamistaService } from 'src/services/prestamista/prestamista.service';
import { PrestatarioService } from 'src/services/prestatario/prestatario.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuario')
@ApiBearerAuth('bearer')
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly prestamistaService: PrestamistaService,
    private readonly prestatarioService: PrestatarioService,
  ) {}

  //
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(3, 2, 1)
  // @Get('detallado/:id')
  // obtenerUsuariosDetallado(@Param('id') id: number) {
  //   return this.usuarioService.obtenerUsuariosDetallado(id);
  // }

  //endpoint para crear un suario
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiBody({
    schema: {
      example: {
        nombre: 'Kevin',
        apellido: 'Quiroz',
        fecha_nacimiento: '1990-01-01',
        telefono: '+593-123456789',
        id_direccion: 1,
        email: 'juan.perez@example.com',
        contraseña: 'hashed_password',
        fecha_registro: '2023-01-01',
        id_tipo: 1,
        estado: true,
      },
    },
  })
  crear(@Body() body: any) {
    return this.usuarioService.crear(body);
  }

  //endpoint para obtener todos los Usuarios
  @Get()
  obtenerTodos() {
    return this.usuarioService.obtenerTodos();
  }

  //endpoint para obtener un usuario por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.usuarioService.obtenerPorId(id);
  }

  //endpoint para actualizar un usuario por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBody({
    schema: {
      example: {
        telefono: '+593-123456789',
        id_direccion: 1,
        email: 'kevin.quiroz@example.com',
        contraseña: 'hashed_password',
        estado: true,
      },
    },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.usuarioService.actualizar(id, body);
  }

  // cambio de tipo con creación inicial de perfil específico
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Post(':id/cambiar-tipo')
  async cambiarTipo(
    @Param('id') id: number,
    @Body()
    body: {
      nuevo_tipo: number;
      capital?: number;
      nombre_negocio?: string;
      ingreso_mensual?: number;
      id_direccion?: number;
    },
  ) {
    return this.usuarioService.cambiarTipoConPerfil(id, body);
  }

  //endpoint para eliminar un usuario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.usuarioService.eliminar(id);
  }
  //#########################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################
}
