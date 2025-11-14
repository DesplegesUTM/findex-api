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
import { PrestamistaService } from 'src/services/prestamista/prestamista.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Prestamista')
@ApiBearerAuth('bearer')
@Controller('prestamista')
export class PrestamistaController {
  constructor(private readonly prestamistaService: PrestamistaService) {}

  // endpoint para crear un prestamista
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Post()
  @ApiOperation({ summary: 'Crear prestamista' })
  @ApiBody({
    schema: {
      example: {
        id_prestamista: 21,
        capital: 10000,
        id_rango: 1,
        estado: true,
      },
    },
  })
  crear(@Body() body: any) {
    return this.prestamistaService.crear(body);
  }

  // engpoint para obtener todos los prestamistas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3, 1)
  @Get()
  async obtenerTodos() {
    return this.prestamistaService.obtenerTodos();
  }

  // engpoint para ontener un prestamista por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.prestamistaService.obtenerPorId(id);
  }

  // endpoint para actualizar un prestamista por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar prestamista' })
  @ApiBody({
    schema: {
      example: {
        capital: 10000,
        id_rango: 1,
        estado: true,
      },
    },
  })
  actualizar(@Param('id') id: number, @Body() body: any) {
    return this.prestamistaService.actualizar(id, body);
  }

  // endpoint para que usuarios actualicen su propio perfil
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3, 2)
  @Put('perfil/:id')
  actualizarPerfil(@Param('id') id: number, @Body() body: any) {
    return this.prestamistaService.actualizarPerfil(id, body);
  }

  // endpoint para crear un prestamista con rango inicial automático
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Post('crear-con-rango-inicial')
  crearConRangoInicial(@Body() body: any) {
    return this.prestamistaService.crearConRangoInicial(body);
  }

  // endpoint especial para que prestatarios creen su primer perfil de prestamista
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2, 3)
  @Post('crear-perfil-inicial')
  crearPerfilInicial(@Body() body: any) {
    return this.prestamistaService.crearConRangoInicial(body);
  }

  // endpoint para actualizar el rango automáticamente
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Put('actualizar-rango/:id')
  actualizarRangoAutomatico(@Param('id') id: number) {
    return this.prestamistaService.actualizarRangoAutomatico(id);
  }

  // endpoint para eliminar unprestamista por el ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.prestamistaService.eliminar(id);
  }
}
