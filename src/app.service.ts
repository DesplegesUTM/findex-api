import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      app_name: 'App Findex',
      app_endpoints: [
        '/usuarios',
        '/prestamista',
        '/prestatario',
        '/oferta-prestamo',
        '/prestamo',
        '/tipo-usuario',
        '/rango',
        '/ciudad',
        '/barrio',
        '/direccion',
        '/frecuencia-pago',
        '/metodo-pago',
        '/solicitud-prestamo',
        '/pago',
      ]
    };
  }
}
