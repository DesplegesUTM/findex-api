import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorador';
import { Result } from 'pg';

@Injectable()
export class PrestatarioService {
  constructor(private readonly db: DatabaseService) {}

  //crear
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async crear(body: any) {
    const {
      id_prestatario,
      nombre_negocio,
      id_direccion,
      ingreso_mensual,
      calificacion_crediticia,
      estado,
    } = body;
    const query = `INSERT INTO prestatario 
    (id_prestatario,
    nombre_negocio,
    id_direccion,
    ingreso_mensual,
    calificacion_crediticia,
    estado)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
    const values = [
      id_prestatario,
      nombre_negocio,
      id_direccion,
      ingreso_mensual,
      calificacion_crediticia,
      estado,
    ];

    try {
      if (
        !id_prestatario ||
        !nombre_negocio ||
        !id_direccion ||
        !ingreso_mensual ||
        !calificacion_crediticia ||
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

  // obtener todos los prestatarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async obtenerTodos() {
    const query = `SELECT * FROM prestatario`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los prestatarios ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un prestatario por el id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3, 2)
  async obtenerPorId(id: number) {
    const query = `SELECT 
                    p.id_prestatario,
                    p.nombre_negocio,
                    p.ingreso_mensual,
                    p.calificacion_crediticia,
                    d.calle1,
                    d.calle2,
                    b.nombre_barrio,
                    c.nombre_ciudad,
                    p.estado
                  FROM prestatario p
                  JOIN direccion d ON p.id_direccion = d.id_direccion
                  JOIN barrio b ON d.id_barrio = b.id_barrio
                  JOIN ciudad c ON b.id_ciudad = c.id_ciudad
                  WHERE p.id_prestatario = $1 AND p.estado = true;`;

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

  // actualizar un prestatario, lo hace mediante el id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async actualizar(id: number, body: any) {
    const {
      nombre_negocio,
      id_direccion,
      ingreso_mensual,
      calificacion_crediticia,
      estado,
    } = body;
    const query = `
          UPDATE prestatario 
          SET nombre_negocio = $1,
          id_direccion = $2,
          ingreso_mensual = $3,
          calificacion_crediticia = $4,
          estado = $5
          WHERE id_prestatario = $6
          RETURNING *`;

    try {
      if (
        !nombre_negocio ||
        !id_direccion ||
        !ingreso_mensual ||
        !calificacion_crediticia ||
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
        nombre_negocio,
        id_direccion,
        ingreso_mensual,
        calificacion_crediticia,
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

  // Método para que los usuarios actualicen su propio perfil de prestatario
  @UseGuards(JwtAuthGuard)
  async actualizarPerfil(id: number, body: any) {
    const {
      nombre_negocio,
      id_direccion,
      ingreso_mensual,
      calificacion_crediticia,
      estado = true, // Por defecto activo
    } = body;

    // Primero verificar si el registro existe
    const existeQuery = 'SELECT * FROM prestatario WHERE id_prestatario = $1';
    const existeResult = await this.db.query(existeQuery, [id]);

    if (existeResult.rows.length === 0) {
      // Si no existe, crear el registro
      const crearQuery = `
        INSERT INTO prestatario (id_prestatario, nombre_negocio, id_direccion, ingreso_mensual, calificacion_crediticia, estado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

      try {
        const result = await this.db.query(crearQuery, [
          id,
          nombre_negocio || `Negocio_${id}`, // Nombre por defecto
          id_direccion || null,
          ingreso_mensual || 0,
          calificacion_crediticia || 0,
          estado,
        ]);
        return {
          message: 'Perfil de prestatario creado exitosamente',
          data: result.rows[0],
        };
      } catch (error) {
        console.error('Error al crear perfil de prestatario:', error);
        throw new HttpException(
          {
            message: 'Error al crear el perfil de prestatario',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      // Si existe, actualizar el registro
      const actualizarQuery = `
        UPDATE prestatario 
        SET nombre_negocio = COALESCE($1, nombre_negocio),
            id_direccion = COALESCE($2, id_direccion),
            ingreso_mensual = COALESCE($3, ingreso_mensual),
            calificacion_crediticia = COALESCE($4, calificacion_crediticia),
            estado = COALESCE($5, estado)
        WHERE id_prestatario = $6
        RETURNING *`;

      try {
        const result = await this.db.query(actualizarQuery, [
          nombre_negocio,
          id_direccion,
          ingreso_mensual,
          calificacion_crediticia,
          estado,
          id,
        ]);
        return {
          message: 'Perfil de prestatario actualizado exitosamente',
          data: result.rows[0],
        };
      } catch (error) {
        console.error('Error al actualizar perfil de prestatario:', error);
        throw new HttpException(
          {
            message: 'Error al actualizar el perfil de prestatario',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // eliminar un prestatario, lo hace mediante el id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async eliminar(id: number) {
    const query = `
          DELETE FROM prestatario
          WHERE id_prestatario = $1 
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
