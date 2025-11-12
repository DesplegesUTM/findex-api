import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { UsuarioService } from './services/usuario/usuario.service';
import { UsuarioController } from './controllers/usuario/usuario.controller';
import { PrestamistaModule } from './modules/prestamista/prestamista.module';
import { PrestamistaController } from './controllers/prestamista/prestamista.controller';
import { PrestamistaService } from './services/prestamista/prestamista.service';
import { PrestatarioModule } from './modules/prestatario/prestatario.module';
import { PrestatarioController } from './controllers/prestatario/prestatario.controller';
import { PrestatarioService } from './services/prestatario/prestatario.service';
import { OfertaPrestamoModule } from './modules/oferta_prestamo/oferta_prestamo.module';
import { OfertaPrestamoController } from './controllers/oferta_prestamo/oferta_prestamo.controller';
import { OfertaPrestamoService } from './services/oferta_prestamo/oferta_prestamo.service';
import { PrestamoModule } from './modules/prestamo/prestamo.module';
import { PrestamoController } from './controllers/prestamo/prestamo.controller';
import { PrestamoService } from './services/prestamo/prestamo.service';
import { PagoModule } from './modules/pago/pago.module';
import { PagoController } from './controllers/pago/pago.controller';
import { PagoService } from './services/pago/pago.service';
import { TipoUsuarioModule } from './modules/tipo_usuario/tipo_usuario.module';
import { TipoUsuarioController } from './controllers/tipo_usuario/tipo_usuario.controller';
import { TipoUsuarioService } from './services/tipo_usuario/tipo_usuario.service';
import { RangoModule } from './modules/rango/rango.module';
import { RangoController } from './controllers/rango/rango.controller';
import { RangoService } from './services/rango/rango.service';
import { CiudadModule } from './modules/ciudad/ciudad.module';
import { CiudadController } from './controllers/ciudad/ciudad.controller';
import { CiudadService } from './services/ciudad/ciudad.service';
import { BarrioModule } from './modules/barrio/barrio.module';
import { BarrioController } from './controllers/barrio/barrio.controller';
import { BarrioService } from './services/barrio/barrio.service';
import { DireccionModule } from './modules/direccion/direccion.module';
import { DireccionController } from './controllers/direccion/direccion.controller';
import { DireccionService } from './services/direccion/direccion.service';
import { FrecuenciaPagoModule } from './modules/frecuencia_pago/frecuencia_pago.module';
import { FrecuenciaPagoController } from './controllers/frecuencia_pago/frecuencia_pago.controller';
import { FrecuenciaPagoService } from './services/frecuencia_pago/frecuencia_pago.service';
import { MetodoPagoModule } from './modules/metodo_pago/metodo_pago.module';
import { MetodoPagoController } from './controllers/metodo_pago/metodo_pago.controller';
import { MetodoPagoService } from './services/metodo_pago/metodo_pago.service';
import { AuthModule } from './auth/auth.module';
import { SolicitudPrestamoModule } from './modules/solicitud_prestamo/solicitud_prestamo.module';
import { SolicitudPrestamoController } from './controllers/solicitud_prestamo/solicitud_prestamo.controller';
import { SolicitudPrestamoService } from './services/solicitud_prestamo/solicitud_prestamo.service';

@Module({
  imports: [
    // Servir archivos de comprobantes estáticamente
    // Servir archivos de comprobantes desde carpeta uploads en la raíz del proyecto
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsuarioModule,
    PrestamistaModule,
    PrestatarioModule,
    OfertaPrestamoModule,
    PrestamoModule,
    PagoModule,
    TipoUsuarioModule,
    RangoModule,
    CiudadModule,
    BarrioModule,
    DireccionModule,
    FrecuenciaPagoModule,
    MetodoPagoModule,
    AuthModule,
    SolicitudPrestamoModule,
  ],
  controllers: [
    AppController,
    UsuarioController,
    PrestamistaController,
    PrestatarioController,
    OfertaPrestamoController,
    PrestamoController,
    // PagoController moved to PagoModule
    TipoUsuarioController,
    RangoController,
    CiudadController,
    BarrioController,
    DireccionController,
    FrecuenciaPagoController,
    MetodoPagoController,
    SolicitudPrestamoController,
  ],
  providers: [
    AppService,
    UsuarioService,
    PrestamistaService,
    PrestatarioService,
    OfertaPrestamoService,
    PrestamoService,
    // PagoService moved to PagoModule
    TipoUsuarioService,
    RangoService,
    CiudadService,
    BarrioService,
    DireccionService,
    FrecuenciaPagoService,
    MetodoPagoService,
    SolicitudPrestamoService,
  ],
})
export class AppModule {}
