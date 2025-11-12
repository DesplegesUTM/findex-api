import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { PagoController } from 'src/controllers/pago/pago.controller';
import { PagoService } from 'src/services/pago/pago.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        // Guardar archivos en la carpeta uploads en la raíz del proyecto (3 niveles arriba de src/modules/pago)
        destination: join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
