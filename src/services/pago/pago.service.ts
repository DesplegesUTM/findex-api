import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class PagoService {
  constructor(private readonly db: DatabaseService) {}
  /// sevicio para manejar los pagos de un solo prestatario
  /**
   * Servicio para manejar los pagos de un solo prestatario
   * @param body
   * @param body.id_prestamo - ID del Prestatario  de la tabla prestamo  asociado al pago
   * @returns
   */
  async obtenerPagosPorPrestatario(id: number) {
    const query = `
                  SELECT 
                  pa.*, 
                  p.*,
                  op.*
                  FROM pago pa
                  JOIN prestamo p ON pa.id_prestamo= p.id_prestamo
                  JOIN oferta_prestamo op ON p.id_oferta = op.id_oferta
                  WHERE p.id_prestatario= $1`;
    try {
      const result = await this.db.query(query, [id]);
      return result.rows;
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error al obtener los pagos del prestatario',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  ///
  ///
  ///
  ///
  //
  //
  //

  //crear
  async crear(body: any) {
    const {
      id_prestamo,
      fecha_pago,
      monto_pagado,
      id_metodo,
      comprobante_url,
      estado,
    } = body;
    const query = `INSERT INTO pago (id_prestamo, fecha_pago, monto_pagado, id_metodo, comprobante_url, estado) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [
      id_prestamo,
      fecha_pago,
      monto_pagado,
      id_metodo,
      comprobante_url,
      estado,
    ];

    try {
      // Validar campos mínimos
      if (
        id_prestamo == null ||
        !fecha_pago ||
        monto_pagado == null ||
        id_metodo == null
      ) {
        throw new HttpException(
          { message: API_DOCUMENTATION_MESSAGE },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar que exista el préstamo
      const prestamoRes = await this.db.query(
        'SELECT id_prestamo FROM prestamo WHERE id_prestamo = $1',
        [id_prestamo],
      );
      if (!prestamoRes.rows[0]) {
        throw new HttpException(
          { message: `El préstamo ${id_prestamo} no existe` },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar monto positivo
      const montoNum = Number(monto_pagado);
      if (!Number.isFinite(montoNum) || montoNum <= 0) {
        throw new HttpException(
          { message: 'El monto pagado debe ser un número mayor a 0' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Calcular saldo del préstamo antes del pago
      const detalleRes = await this.db.query(
        `SELECT op.nro_cuotas, op.monto_cuota
         FROM prestamo p
         JOIN oferta_prestamo op ON p.id_oferta = op.id_oferta
         WHERE p.id_prestamo = $1`,
        [id_prestamo],
      );
      const det = detalleRes.rows[0];
      if (!det) {
        throw new HttpException(
          { message: 'No se pudo obtener detalle del préstamo/oferta' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const totalAPagar = Number(det.nro_cuotas) * Number(det.monto_cuota);
      const sumRes = await this.db.query(
        'SELECT COALESCE(SUM(monto_pagado),0) AS total_pagado FROM pago WHERE id_prestamo = $1',
        [id_prestamo],
      );
      const totalPagado = Number(sumRes.rows[0]?.total_pagado ?? 0);
      const saldo = +(totalAPagar - totalPagado).toFixed(2);

      if (saldo <= 0) {
        throw new HttpException(
          {
            message:
              'El préstamo ya está completamente pagado. No se pueden registrar más pagos.',
            detalle: {
              total_pagado: totalPagado,
              total_a_pagar: totalAPagar,
              saldo_restante: 0,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (montoNum > saldo) {
        throw new HttpException(
          {
            message: 'El monto del pago excede el saldo restante del préstamo',
            detalle: { saldo_restante: saldo, monto_intentado: montoNum },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar que exista el método de pago
      const metodoRes = await this.db.query(
        'SELECT id_metodo FROM metodo_pago WHERE id_metodo = $1',
        [id_metodo],
      );
      if (!metodoRes.rows[0]) {
        throw new HttpException(
          { message: `El método de pago ${id_metodo} no existe` },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar comprobante obligatorio
      if (!comprobante_url) {
        throw new HttpException(
          { message: 'El comprobante es obligatorio' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error al crear el registro',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener todos los prestamos
  async obtenerTodos() {
    const query = `SELECT * FROM pago`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los pagos ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un pago por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM pago WHERE id_pago = $1`;
    try {
      const result = await this.db.query(query, [id]);
      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `no se ha encontrado resgistro con el ID: ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Obtener todos los pagos de un préstamo específico
   * @param id_prestamo - ID del préstamo
   */
  async obtenerPagosPorPrestamo(id_prestamo: number) {
    const query = `SELECT * FROM pago WHERE id_prestamo = $1`;
    try {
      const result = await this.db.query(query, [id_prestamo]);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los pagos del préstamo',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // actualizar un pago, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { monto_pagado, id_metodo, comprobante_url, estado } = body;
    const query = `
          UPDATE pago 
          SET monto_pagado = $1, id_metodo = $2, comprobante_url = $3, estado = $4
          WHERE id_pago = $5 RETURNING *`;

    try {
      if (
        !monto_pagado ||
        !id_metodo ||
        !comprobante_url ||
        typeof estado !== 'boolean'
      ) {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [
        monto_pagado,
        id_metodo,
        comprobante_url,
        estado,
        id,
      ]);

      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `No se encuentra registro con este ID: ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // eliminar un pago, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM pago
          WHERE id_pago = $1 
          RETURNING *`;
    try {
      const result = await this.db.query(query, [id]);
      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `No se encuentra registro con el ID ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error al eliminar el registro',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Obtener pagos por id_oferta
  async obtenerPagosPorOferta(id_oferta: number) {
    const query = `
        SELECT pa.*
        FROM pago pa
        JOIN prestamo p ON pa.id_prestamo = p.id_prestamo
        WHERE p.id_oferta = $1`;
    try {
      const result = await this.db.query(query, [id_oferta]);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los pagos por oferta',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
