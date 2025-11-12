import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class BarrioService {
  constructor(private readonly db: DatabaseService) {}

  //Obtener los barrios por cada ciudad
  async barrioPorCiudad(id: number) {
    const query = ` 
      SELECT
        b.id_barrio,
        b.id_ciudad,
        b.nombre_barrio,
        b.estado,
        c.nombre_ciudad
      FROM barrio AS b
      JOIN ciudad AS c
        ON b.id_ciudad = c.id_ciudad
      WHERE b.id_ciudad = $1
        AND b.estado = true
      ORDER BY b.nombre_barrio;`;
    const result = await this.db.query(query, [id]);
    return result.rows;
  }

  //crear
  async crear(body: any) {
    const { id_ciudad, nombre_barrio, estado } = body;
    const query = `INSERT INTO barrio (id_ciudad, nombre_barrio, estado) VALUES($1, $2, $3) RETURNING *`;
    const values = [id_ciudad, nombre_barrio, estado];

    try {
      if (!id_ciudad || !nombre_barrio || typeof estado !== 'boolean') {
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

  // obtener todos los barrios
  async obtenerTodos() {
    const query = `SELECT * FROM barrio`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los barrios ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un barrio por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM barrio WHERE id_barrio = $1`;
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

  // actualizar un barrio, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { id_ciudad, nombre_barrio, estado } = body;
    const query = `
           UPDATE barrio 
           SET id_ciudad = $1, nombre_barrio = $2, estado = $3
           WHERE id_barrio = $4 RETURNING *`;

    try {
      if (typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [
        id_ciudad,
        nombre_barrio,
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

  // eliminar un barrio, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
           DELETE FROM barrio
           WHERE id_barrio = $1 
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
