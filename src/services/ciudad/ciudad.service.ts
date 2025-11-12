import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class CiudadService {
  constructor(private readonly db: DatabaseService) {}

  //crear
  async crear(body: any) {
    const { nombre_ciudad, estado } = body;
    const query = `INSERT INTO ciudad (nombre_ciudad, estado) VALUES($1, $2) RETURNING *`;
    const values = [nombre_ciudad, estado];

    try {
      if (!nombre_ciudad || typeof estado !== 'boolean') {
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
    const query = `SELECT * FROM ciudad`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los ciudads ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un ciudad por el id
  async obtenerPorId(id: number) {
    const query = `SELECT * FROM ciudad WHERE id_ciudad = $1`;
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

  // actualizar un ciudad, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const { nombre_ciudad, estado } = body;
    const query = `
          UPDATE ciudad 
          SET nombre_ciudad = $1, estado = $2
          WHERE id_ciudad = $3 RETURNING *`;

    try {
      if (!nombre_ciudad || typeof estado !== 'boolean') {
        throw new HttpException(
          {
            message: API_DOCUMENTATION_MESSAGE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.db.query(query, [nombre_ciudad, estado, id]);

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

  // eliminar un ciudad, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM ciudad
          WHERE id_ciudad = $1 
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
