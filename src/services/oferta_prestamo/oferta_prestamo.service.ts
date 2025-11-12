import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class OfertaPrestamoService {
  constructor(private readonly db: DatabaseService) {}

  //validar codigo de oferta de prestamo

  async validarCodigo(codigo: any) {
    const query = `
                  SELECT 
                  codigo_oferta
                  FROM oferta_prestamo
                  WHERE codigo_oferta = $1`;
    const result = await this.db.query(query, [codigo]);
    return result.rows[0];
  }
  //APIS QUE SE SIRVEN A LA APLICACION, FINDEX, PARA VISUALIZAR LAS OFERTAS DE PRESTAMOS EN EN LA PAGINA INICIAL DE LA APLICACION O FEED
  async obtenerPrestamos() {
    const query = `SELECT 
                    o.id_oferta,
                    o.codigo_oferta,  
                    o.monto,
                    o.tasa_interes,
                    o.nro_cuotas,
                    o.monto_cuota,
                    o.fecha_publicacion,
                    f.frecuencia_pago,
                    u.nombre AS nombre_prestamista,
                    u.apellido AS apellido_prestamista,
                    p.capital,
                    r.rango
                  FROM oferta_prestamo o
                  JOIN prestamista p ON o.id_prestamista = p.id_prestamista
                  JOIN usuario u ON p.id_prestamista = u.id_usuario
                  JOIN rango r ON p.id_rango = r.id_rango
                  JOIN frecuencia_pago f ON o.id_frecuencia = f.id_frecuencia
                  WHERE o.estado = true;`;
    try {
      const result = await this.db.query(query);
      if (!result.rows.length) {
        throw new HttpException(
          {
            message: 'No hay ofertas de prestamos disponibles',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result.rows;
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error al obtener las ofertas de prestamos',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  ///obtener por el id
  async obtenerPrestamo(id: number) {
    const query = `SELECT 
                    o.id_oferta,
                    o.codigo_oferta,
                    o.monto,
                    o.tasa_interes,
                    o.nro_cuotas,
                    o.monto_cuota,
                    o.fecha_publicacion,
                    f.frecuencia_pago,
                    u.nombre AS nombre_prestamista,
                    u.apellido AS apellido_prestamista,
                    p.capital,
                    r.rango
                  FROM oferta_prestamo o
                  JOIN prestamista p ON o.id_prestamista = p.id_prestamista
                  JOIN usuario u ON p.id_prestamista = u.id_usuario
                  JOIN rango r ON p.id_rango = r.id_rango
                  JOIN frecuencia_pago f ON o.id_frecuencia = f.id_frecuencia
                  WHERE o.estado = true AND o.id_oferta = $1;`;
    try {
      const result = await this.db.query(query, [id]);
      if (!result.rows.length) {
        throw new HttpException(
          {
            message: 'No hay ofertas de prestamos disponibles',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result.rows[0];
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error al obtener las ofertas de prestamos',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // ofertas pertenecientes a un prestamista específico
  async obtenerPorPrestamista(id_prestamista: number) {
    const query = `SELECT 
                    o.id_oferta,
                    o.codigo_oferta,
                    o.monto,
                    o.tasa_interes,
                    o.nro_cuotas,
                    o.monto_cuota,
                    o.fecha_publicacion,
                    o.estado,
                    f.frecuencia_pago
                  FROM oferta_prestamo o
                  JOIN frecuencia_pago f ON o.id_frecuencia = f.id_frecuencia
                  WHERE o.id_prestamista = $1
                  ORDER BY o.fecha_publicacion DESC`;
    try {
      const result = await this.db.query(query, [id_prestamista]);
      return result.rows; // puede estar vacío (sin ofertas aún)
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error al obtener ofertas del prestamista',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // APIS PARA LA TABLA OFERTA_PRESTAMO MUESTRA SOLO LOS ATRIBUTOS DE LAS TABLAS QUE SE NECESITAN PARA LA OFERTA DE PRESTAMO, NO MUESTRA LOS ATRIBUTOS DE LAS TABLAS RELACIONADAS, SOLO LOS QUE SON NECESARIOS PARA LA OFERTA DE PRESTAMO
  // ESTAS NO SE VAN A USAR EN LA APLICACION, SOLO SE VA A USAR PARA EL DESARROLLO PARA PODER INGRESRA DATOS FACILEMNTE PARA PRUEVAS
  //#########################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################

  //
  //crear
  async crear(body: any) {
    const {
      id_prestamista,
      codigo_oferta,
      monto,
      tasa_interes,
      id_frecuencia,
      nro_cuotas,
      monto_cuota,
      fecha_publicacion,
      estado,
    } = body;
    const query = `INSERT INTO oferta_prestamo (id_prestamista,
      codigo_oferta,
      monto,
      tasa_interes,
      id_frecuencia,
      nro_cuotas,
      monto_cuota,
      fecha_publicacion,
      estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const values = [
      id_prestamista,
      codigo_oferta,
      monto,
      tasa_interes,
      id_frecuencia,
      nro_cuotas,
      monto_cuota,
      fecha_publicacion,
      estado,
    ];

    try {
      if (
        !id_prestamista ||
        !codigo_oferta ||
        !monto ||
        !tasa_interes ||
        !id_frecuencia ||
        !nro_cuotas ||
        !monto_cuota ||
        !fecha_publicacion ||
        typeof estado !== 'boolean'
      ) {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Validar capital del prestamista
      const capRes = await this.db.query(
        'SELECT capital FROM prestamista WHERE id_prestamista = $1',
        [id_prestamista],
      );
      if (!capRes.rows[0]) {
        throw new HttpException(
          { message: 'Prestamista no encontrado' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const capital = Number(capRes.rows[0].capital);
      const montoNum = Number(monto);
      if (!Number.isFinite(montoNum) || montoNum <= 0) {
        throw new HttpException(
          { message: 'El monto debe ser un número válido mayor a 0' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (montoNum > capital) {
        throw new HttpException(
          {
            message:
              'El monto de la oferta excede el capital disponible del prestamista',
            detalle: {
              capital_disponible: capital,
              monto_solicitado: montoNum,
            },
          },
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

  // obtener todos los oferta_prestamos
  async obtenerTodos() {
    const query = `SELECT * FROM oferta_prestamo`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los oferta_prestamos ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un oferta_prestamo por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM oferta_prestamo WHERE id_oferta = $1`;
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

  // actualizar un oferta_prestamo, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const {
      monto,
      tasa_interes,
      id_frecuencia,
      nro_cuotas,
      monto_cuota,
      estado,
    } = body;
    const query = `
          UPDATE oferta_prestamo 
          SET monto = $1, tasa_interes = $2, id_frecuencia = $3, nro_cuotas = $4, monto_cuota = $5, estado = $6
          WHERE id_oferta = $7 RETURNING *`;
    try {
      if (
        !monto ||
        !tasa_interes ||
        !id_frecuencia ||
        !nro_cuotas ||
        !monto_cuota ||
        typeof estado !== 'boolean'
      ) {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // Validar contra capital del prestamista dueño de la oferta
      const ownerQuery = `SELECT id_prestamista FROM oferta_prestamo WHERE id_oferta = $1`;
      const ownerRes = await this.db.query(ownerQuery, [id]);
      if (!ownerRes.rows[0]) {
        throw new HttpException(
          { message: `No se encuentra registro con este ID: ${id}` },
          HttpStatus.NOT_FOUND,
        );
      }
      const id_prestamista_owner = ownerRes.rows[0].id_prestamista;
      const capQuery = `SELECT capital FROM prestamista WHERE id_prestamista = $1`;
      const capRes = await this.db.query(capQuery, [id_prestamista_owner]);
      const capital = parseFloat(capRes.rows[0]?.capital ?? 0);
      const montoNum = parseFloat(monto);
      if (montoNum > capital) {
        throw new HttpException(
          {
            message:
              'El monto de la oferta excede el capital disponible del prestamista',
            detalle: {
              capital_disponible: capital,
              monto_solicitado: montoNum,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.db.query(query, [
        monto,
        tasa_interes,
        id_frecuencia,
        nro_cuotas,
        monto_cuota,
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

  // eliminar un oferta_prestamo, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM oferta_prestamo
          WHERE id_oferta = $1 
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
