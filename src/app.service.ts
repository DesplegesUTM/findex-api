import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      app_name: 'App Findex',
      app_endpoints: [
        '/prestamista',
        '/direccion',
        '/frecuencia-pago',
        '/prestatario',
        '/metodo-pago',
        '/rango',
        '/ciudad',
        '/barrio',
        '/pago',
        '/solicitud-prestamo',
        '/oferta-prestamo',
        '/usuarios',
        '/prestamo',
        '/tipo-usuario',
      ]
    };
  }
}
