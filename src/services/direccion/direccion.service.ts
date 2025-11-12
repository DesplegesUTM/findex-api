import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';
@Injectable()
export class DireccionService {
  constructor(private readonly db: DatabaseService) {}

  //crear
  async crear(body: any) {
    const { id_barrio, calle1, calle2, estado } = body;
    const query = `INSERT INTO direccion (id_barrio, calle1, calle2, estado) VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [id_barrio, calle1, calle2, estado];

    try {
      if (!id_barrio || !calle1 || !calle2 || typeof estado !== 'boolean') {
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

  // obtener todos los prestamos
  async obtenerTodos() {
    const query = `SELECT * FROM direccion`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los direccions ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un direccion por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM direccion WHERE id_direccion = $1`;
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

  // obtener una dirección completa con información de ciudad y barrio
  async obtenerDireccionCompleta(id: number) {
    const query = `
      SELECT 
        d.id_direccion,
        d.calle1,
        d.calle2,
        d.estado as direccion_estado,
        b.id_barrio,
        b.barrio,
        c.id_ciudad,
        c.ciudad
      FROM direccion d
      INNER JOIN barrio b ON d.id_barrio = b.id_barrio
      INNER JOIN ciudad c ON b.id_ciudad = c.id_ciudad
      WHERE d.id_direccion = $1
    `;
    try {
      const result = await this.db.query(query, [id]);
      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `no se ha encontrado dirección con el ID: ${id}`,
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

  // actualizar un direccion, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { calle1, calle2, estado } = body;
    const query = `
          UPDATE direccion 
          SET calle1 = $1, calle2 = $2, estado = $3
          WHERE id_direccion = $4 RETURNING *`;

    try {
      if (!calle1 || !calle2 || typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [calle1, calle2, estado, id]);

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

  // eliminar un direccion, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM direccion
          WHERE id_direccion = $1 
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

  // obtener todas las calles1 disponibles
  async obtenerCalles1() {
    const query = `SELECT DISTINCT calle1 FROM direccion WHERE estado = true ORDER BY calle1`;
    try {
      const result = await this.db.query(query);
      return result.rows.map((row) => ({ calle: row.calle1 }));
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener las calles1',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener todas las calles2 disponibles
  async obtenerCalles2() {
    const query = `SELECT DISTINCT calle2 FROM direccion WHERE estado = true ORDER BY calle2`;
    try {
      const result = await this.db.query(query);
      return result.rows.map((row) => ({ calle: row.calle2 }));
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener las calles2',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener direcciones por barrio
  async obtenerDireccionesPorBarrio(id_barrio: number) {
    const query = `
      SELECT id_direccion, calle1, calle2, id_barrio 
      FROM direccion 
      WHERE id_barrio = $1 AND estado = true 
      ORDER BY calle1, calle2
    `;
    try {
      const result = await this.db.query(query, [id_barrio]);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener las direcciones del barrio',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
