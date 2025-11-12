import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class PrestamistaService {
  constructor(private readonly db: DatabaseService) {}

  //crear
  async crear(body: any) {
    const { id_prestamista, capital, id_rango, estado } = body;
    const query = `INSERT INTO prestamista (id_prestamista, capital, id_rango, estado) VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [id_prestamista, capital, id_rango, estado];

    try {
      if (
        !id_prestamista ||
        !capital ||
        !id_rango ||
        typeof estado !== 'boolean'
      ) {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
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

  // obtener todos los prestamistas
  async obtenerTodos() {
    const query = `SELECT * FROM prestamista`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los prestamistas ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un prestamista por el id
  async obtenerPorId(id: number) {
    const query = `SELECT 
  p.capital,
  r.rango,
  p.estado
FROM prestamista p
JOIN rango r ON p.id_rango = r.id_rango
WHERE p.id_prestamista = $1;
;
`;
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

  // actualizar un prestamista, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { capital, id_rango, estado } = body;
    const query = `
          UPDATE prestamista 
          SET capital = $1, id_rango = $2, estado = $3
          WHERE id_prestamista = $4 RETURNING *`;

    try {
      if (!capital || !id_rango || typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [
        capital,
        id_rango,
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

  // eliminar un prestamista, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM prestamista
          WHERE id_prestamista = $1 
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

  // Método para que los usuarios actualicen su propio perfil de prestamista
  async actualizarPerfil(id: number, body: any) {
    const {
      capital,
      id_rango,
      estado = true, // Por defecto activo
    } = body;

    // Primero verificar si el registro existe
    const existeQuery = 'SELECT * FROM prestamista WHERE id_prestamista = $1';
    const existeResult = await this.db.query(existeQuery, [id]);

    if (existeResult.rows.length === 0) {
      // Si no existe, crear el registro
      const crearQuery = `
        INSERT INTO prestamista (id_prestamista, capital, id_rango, estado)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;

      try {
        const result = await this.db.query(crearQuery, [
          id,
          capital || 0, // Capital por defecto 0
          id_rango || 1, // Rango por defecto
          estado,
        ]);
        return {
          message: 'Perfil de prestamista creado exitosamente',
          data: result.rows[0],
        };
      } catch (error) {
        console.error('Error al crear perfil de prestamista:', error);
        throw new HttpException(
          {
            message: 'Error al crear el perfil de prestamista',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      // Si existe, actualizar el registro (sin incluir id_rango - se calcula automáticamente)
      const actualizarQuery = `
        UPDATE prestamista 
        SET capital = COALESCE($1, capital),
            estado = COALESCE($2, estado)
        WHERE id_prestamista = $3
        RETURNING *`;

      try {
        // Actualizar datos básicos
        const result = await this.db.query(actualizarQuery, [
          capital,
          estado,
          id,
        ]);

        // Recalcular y actualizar el rango automáticamente
        await this.actualizarRangoAutomatico(id);

        // Obtener el registro actualizado con el nuevo rango
        const finalResult = await this.obtenerPorId(id);

        return {
          message:
            'Perfil de prestamista actualizado exitosamente con rango recalculado',
          data: finalResult,
        };
      } catch (error) {
        console.error('Error al actualizar perfil de prestamista:', error);
        throw new HttpException(
          {
            message: 'Error al actualizar el perfil de prestamista',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Método para calcular el rango automáticamente basado en préstamos completados
  async calcularRangoAutomatico(id_prestamista: number): Promise<number> {
    try {
      // Consulta para obtener estadísticas de préstamos completados
      const query = `
        SELECT 
          COUNT(*) as total_prestamos,
          COALESCE(SUM(op.monto), 0) as monto_total
        FROM prestamo p
        INNER JOIN oferta_prestamo op ON p.id_oferta = op.id_oferta
        INNER JOIN pago pg ON p.id_prestamo = pg.id_prestamo
        WHERE op.id_prestamista = $1 
          AND p.estado = true
          AND pg.estado = true
        GROUP BY p.id_prestamo
        HAVING COUNT(pg.id_pago) >= (
          SELECT op2.nro_cuotas 
          FROM oferta_prestamo op2 
          WHERE op2.id_oferta = p.id_oferta
        )
      `;

      const result = await this.db.query(query, [id_prestamista]);

      let totalPrestamos = 0;
      let montoTotal = 0;

      // Sumar todos los préstamos completados
      if (result.rows.length > 0) {
        totalPrestamos = result.rows.length;
        montoTotal = result.rows.reduce(
          (sum, row) => sum + parseFloat(row.monto_total || 0),
          0,
        );
      }

      // Lógica para determinar el rango basado en criterios
      let rangoId = 1; // Platino por defecto (rango inicial)

      if (totalPrestamos >= 10 && montoTotal >= 100000) {
        rangoId = 3; // Diamante: 10+ préstamos completados y $100,000+ en total
      } else if (totalPrestamos >= 5 && montoTotal >= 50000) {
        rangoId = 2; // Oro: 5+ préstamos completados y $50,000+ en total
      }
      // Si no cumple criterios superiores, mantiene Platino (1)

      return rangoId;
    } catch (error) {
      console.error('Error al calcular rango automático:', error);
      return 1; // Retorna Platino por defecto en caso de error
    }
  }

  // Método para crear un prestamista con rango inicial automático
  async crearConRangoInicial(body: any) {
    const { id_prestamista, capital, estado = true } = body;

    // Asignar rango inicial (Platino = 1) automáticamente
    const id_rango = 1;

    const query = `INSERT INTO prestamista (id_prestamista, capital, id_rango, estado) VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [id_prestamista, capital, id_rango, estado];

    try {
      if (!id_prestamista || capital == null) {
        throw new HttpException(
          {
            message:
              'id_prestamista y capital son requeridos (capital puede ser 0)',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.db.query(query, values);
      return {
        message: 'Prestamista creado exitosamente con rango inicial',
        data: result.rows[0],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error al crear el prestamista',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método para actualizar el rango de un prestamista automáticamente
  async actualizarRangoAutomatico(id_prestamista: number) {
    try {
      const nuevoRango = await this.calcularRangoAutomatico(id_prestamista);

      const query = `UPDATE prestamista SET id_rango = $1 WHERE id_prestamista = $2 RETURNING *`;
      const result = await this.db.query(query, [nuevoRango, id_prestamista]);

      return {
        message: 'Rango actualizado automáticamente',
        data: result.rows[0],
        nuevoRango: nuevoRango,
      };
    } catch (error) {
      console.error('Error al actualizar rango automático:', error);
      throw new HttpException(
        {
          message: 'Error al actualizar el rango automáticamente',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
