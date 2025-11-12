import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class PrestamoService {
  constructor(private db: DatabaseService) {}
  //Ontiene todos los prestamos del usuario Prestamista
  async obtenerPorPrestamista(id: number) {
    const query = `SELECT 
          pr.id_prestamo,
          pr.fecha_inicio,
          pr.fecha_fin,
          pr.estado,
          u.nombre AS nombre_prestatario,
          u.apellido AS apellido_prestatario,
          op.id_oferta,
          op.monto,
          op.tasa_interes,
          op.nro_cuotas,
          op.monto_cuota
            FROM prestamo pr
            JOIN oferta_prestamo op ON pr.id_oferta = op.id_oferta
            JOIN prestatario pt ON pr.id_prestatario = pt.id_prestatario
            JOIN usuario u ON pt.id_prestatario = u.id_usuario
            WHERE op.id_prestamista = $1;`;
    try {
      const result = await this.db.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los prestamos ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //obtener todos los prestamos del tipo usuario Prestatario
  async obtenerPorPrestatario(id: number) {
    const query = `SELECT 
          pr.id_prestamo,
          pr.fecha_inicio,
          pr.fecha_fin,
          pr.estado,
          upre.nombre AS nombre_prestamista,
          upre.apellido AS apellido_prestamista,
          op.id_oferta,
          op.monto,
          op.tasa_interes,
          op.nro_cuotas,
          op.monto_cuota
        FROM prestamo pr
        JOIN oferta_prestamo op 
          ON pr.id_oferta = op.id_oferta
        JOIN prestamista p 
          ON op.id_prestamista = p.id_prestamista
        JOIN usuario upre 
          ON p.id_prestamista = upre.id_usuario
        WHERE pr.id_prestatario = $1;`;
    try {
      const result = await this.db.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los prestamos ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //crear
  async crear(body: any) {
    const { id_oferta, id_prestatario, fecha_inicio, fecha_fin, estado } = body;
    // Inserta el préstamo y descuenta capital del prestamista de forma atómica
    const atomicInsertQuery = `
      WITH oferta AS (
        SELECT id_prestamista, monto
        FROM oferta_prestamo
        WHERE id_oferta = $1
      ),
      updated AS (
        UPDATE prestamista p
        SET capital = p.capital - o.monto
        FROM oferta o
        WHERE p.id_prestamista = o.id_prestamista
          AND p.capital >= o.monto
        RETURNING p.id_prestamista
      ),
      inserted AS (
        INSERT INTO prestamo (id_oferta, id_prestatario, fecha_inicio, fecha_fin, estado)
        SELECT $1, $2, $3, $4, $5
        FROM updated
        RETURNING *
      )
      SELECT * FROM inserted;
    `;

    try {
      if (
        !id_oferta ||
        !id_prestatario ||
        !fecha_inicio ||
        !fecha_fin ||
        typeof estado !== 'boolean'
      ) {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Validación mínima de payload
      const missing = [id_oferta, id_prestatario, fecha_inicio, fecha_fin].some(
        (v) => v === undefined || v === null,
      );
      if (missing || typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar existencia de la oferta primero para diferenciar el error
      const ofertaRes = await this.db.query(
        'SELECT id_prestamista, monto FROM oferta_prestamo WHERE id_oferta = $1',
        [id_oferta],
      );
      if (!ofertaRes.rows[0]) {
        throw new HttpException(
          { message: 'Oferta no encontrada' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Ejecutar operación atómica: descontar capital e insertar préstamo
      const result = await this.db.query(atomicInsertQuery, [
        id_oferta,
        id_prestatario,
        fecha_inicio,
        fecha_fin,
        estado,
      ]);

      if (!result.rows[0]) {
        // No se insertó porque no se pudo descontar capital (insuficiente)
        const monto = Number(ofertaRes.rows[0].monto);
        const capRes = await this.db.query(
          'SELECT capital FROM prestamista WHERE id_prestamista = $1',
          [ofertaRes.rows[0].id_prestamista],
        );
        const capital = Number(capRes.rows[0]?.capital ?? 0);
        throw new HttpException(
          {
            message: 'Capital insuficiente para originar el préstamo',
            detalle: { capital_disponible: capital, monto_necesario: monto },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

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
    const query = `SELECT * FROM prestamo `;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los prestamos ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un prestamo por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM prestamo WHERE id_prestamo = $1`;
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

  // obtener un prestamo por oferta y prestatario (usuario autenticado)
  async obtenerPorOfertaYPrestatario(id_oferta: number, id_usuario: number) {
    const query = `
      SELECT pr.*
      FROM prestamo pr
      WHERE pr.id_oferta = $1 AND pr.id_prestatario = $2
      LIMIT 1;
    `;
    try {
      if (!id_oferta || !id_usuario) {
        throw new HttpException(
          { message: API_DOCUMENTATION_MESSAGE },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [id_oferta, id_usuario]);
      if (!result.rows[0]) {
        throw new HttpException(
          { message: 'No existe préstamo para esta oferta y usuario' },
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

  // actualizar un prestamo, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { fecha_inicio, fecha_fin, estado } = body;
    const query = `
          UPDATE prestamo 
          SET fecha_inicio = $1, fecha_fin = $2, estado = $3
          WHERE id_prestamo = $4 RETURNING *`;

    try {
      if (!fecha_inicio || !fecha_fin || typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [
        fecha_inicio,
        fecha_fin,
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

  // eliminar un prestamo, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM prestamo
          WHERE id_prestamo = $1 
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
}
