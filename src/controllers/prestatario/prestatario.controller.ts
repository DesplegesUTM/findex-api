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
import { PrestatarioService } from 'src/services/prestatario/prestatario.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Prestatario')
@ApiBearerAuth('bearer')
@Controller('prestatario')
export class PrestatarioController {
  constructor(private readonly prestatarioService: PrestatarioService) {}

  // endpoint para crear un Prestatario
  @Post()
  @ApiOperation({ summary: 'Crear prestatario' })
  @ApiBody({
    schema: {
      example: {
        id_prestatario: 1,
        nombre_negocio: 'Negocio de Prueba',
        id_direccion: 1,
        ingreso_mensual: 1800,
        calificacion_crediticia: 5,
        estado: true,
      },
    },
  })
  crear(@Body() body: any) {
    return this.prestatarioService.crear(body);
  }

  // engpoint para obtener todos los prestatarios
  @Get()
  obtenerTodos() {
    return this.prestatarioService.obtenerTodos();
  }

  // endpoint para obtener un prestatario por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.prestatarioService.obtenerPorId(id);
  }

  // endpoint para actualizar un prestatario por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2, 3)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar prestatario' })
  @ApiBody({
    schema: {
      example: {
        nombre_negocio: 'Negocio de Prueba',
        id_direccion: 1,
        ingreso_mensual: 1800,
        calificacion_crediticia: 5,
        estado: true,
      },
    },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.prestatarioService.actualizar(id, body);
  }

  // endpoint para que usuarios actualicen su propio perfil
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(2, 3)
  @Put('perfil/:id')
  actualizarPerfil(@Param('id') id: number, @Body() body: any) {
    return this.prestatarioService.actualizarPerfil(id, body);
  }

  // endpoint especial para que prestamistas creen su primer perfil de prestatario
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Post('crear-perfil-inicial')
  crearPerfilInicial(@Body() body: any) {
    return this.prestatarioService.crear(body);
  }

  // endpoint para eliminar un prestatario por el ID
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.prestatarioService.eliminar(id);
  }
}
