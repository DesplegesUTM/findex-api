import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';
import { PrestamistaService } from '../prestamista/prestamista.service';
import { PrestatarioService } from '../prestatario/prestatario.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly db: DatabaseService,
    private readonly prestamistaService: PrestamistaService,
    private readonly prestatarioService: PrestatarioService,
  ) {}
  // CRUD DE USUARIO NORMAL
  //crear
  async crear(body: any) {
    const {
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      id_direccion,
      email,
      contraseña,
      fecha_registro,
      id_tipo,
      estado,
    } = body;
    const query = `INSERT INTO usuario (nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      id_direccion,
      email,
      contraseña,
      fecha_registro,
      id_tipo,
      estado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      id_direccion,
      email,
      contraseña,
      fecha_registro,
      id_tipo,
      estado,
    ];

    try {
      if (
        !nombre ||
        !apellido ||
        !fecha_nacimiento ||
        !telefono ||
        !id_direccion ||
        !email ||
        !contraseña ||
        !fecha_registro ||
        !id_tipo ||
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

  // obtener todos los usuarios
  async obtenerTodos() {
    const query = `SELECT * FROM usuario`;
    try {
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error al obtener los usuarios ',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // obtener un usuario por el id
  async obtenerPorId(id: number) {
    const query = `
    SELECT
                       u.id_usuario,
                       u.nombre,
                       u.apellido,
                       u.telefono,
                       u.fecha_nacimiento,
                       u.email,
                       u.id_tipo,
                       d.calle1,
                       d.calle2,
                       b.nombre_barrio,
                       c.nombre_ciudad
                     FROM usuario u
                     LEFT JOIN direccion d ON u.id_direccion = d.id_direccion
                     LEFT JOIN barrio b ON d.id_barrio = b.id_barrio
                     LEFT JOIN ciudad c ON b.id_ciudad = c.id_ciudad
                     WHERE u.id_usuario=$1 AND u.estado = true;`;
    try {
      const result = await this.db.query(query, [id]);
      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `no se ha encontrado registro con el ID: ${id}`,
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

  // actualizar un usuario, lo hace mediante el id
  async actualizar(id: number, body: any) {
    const {
      nombre,
      apellido,
      telefono,
      fecha_nacimiento,
      id_ciudad,
      id_barrio,
      id_direccion,
      email,
      contraseña,
      id_tipo,
      estado,
    } = body;

    // Primero obtener los datos actuales del usuario para comparar
    let usuarioActual;
    try {
      const queryActual = `SELECT * FROM usuario WHERE id_usuario = $1`;
      const resultActual = await this.db.query(queryActual, [id]);
      usuarioActual = resultActual.rows[0];

      if (!usuarioActual) {
        throw new HttpException(
          {
            message: `No se encuentra registro con este ID: ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Error al obtener datos del usuario',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Construir query dinámicamente solo con campos que se van a actualizar
    const camposActualizar: string[] = [];
    const valores: any[] = [];
    let contador = 1;

    if (
      nombre !== undefined &&
      nombre !== null &&
      nombre !== usuarioActual.nombre
    ) {
      camposActualizar.push(`nombre = $${contador}`);
      valores.push(nombre);
      contador++;
    }

    if (
      apellido !== undefined &&
      apellido !== null &&
      apellido !== usuarioActual.apellido
    ) {
      camposActualizar.push(`apellido = $${contador}`);
      valores.push(apellido);
      contador++;
    }

    if (
      telefono !== undefined &&
      telefono !== null &&
      telefono !== usuarioActual.telefono
    ) {
      camposActualizar.push(`telefono = $${contador}`);
      valores.push(telefono);
      contador++;
    }

    if (
      fecha_nacimiento !== undefined &&
      fecha_nacimiento !== null &&
      fecha_nacimiento !== usuarioActual.fecha_nacimiento
    ) {
      camposActualizar.push(`fecha_nacimiento = $${contador}`);
      valores.push(fecha_nacimiento);
      contador++;
    }

    // Solo actualizar id_direccion si se proporciona directamente
    // Los campos id_ciudad e id_barrio no existen en la tabla usuario
    if (
      id_direccion !== undefined &&
      id_direccion !== null &&
      id_direccion !== usuarioActual.id_direccion
    ) {
      camposActualizar.push(`id_direccion = $${contador}`);
      valores.push(id_direccion);
      contador++;
    }

    if (
      email !== undefined &&
      email !== null &&
      email !== usuarioActual.email
    ) {
      camposActualizar.push(`email = $${contador}`);
      valores.push(email);
      contador++;
    }

    if (contraseña !== undefined && contraseña !== null) {
      camposActualizar.push(`contraseña = $${contador}`);
      valores.push(contraseña);
      contador++;
    }

    if (
      id_tipo !== undefined &&
      id_tipo !== null &&
      id_tipo !== usuarioActual.id_tipo
    ) {
      camposActualizar.push(`id_tipo = $${contador}`);
      valores.push(id_tipo);
      contador++;
    }

    if (
      estado !== undefined &&
      estado !== null &&
      estado !== usuarioActual.estado
    ) {
      camposActualizar.push(`estado = $${contador}`);
      valores.push(estado);
      contador++;
    }

    // Si no hay campos para actualizar, retornar el usuario actual
    if (camposActualizar.length === 0) {
      return {
        message: 'No hay cambios para actualizar',
        data: usuarioActual,
      };
    }

    // Agregar el ID al final
    valores.push(id);

    const query = `
      UPDATE usuario 
      SET ${camposActualizar.join(', ')}
      WHERE id_usuario = $${contador} 
      RETURNING *`;

    try {
      const result = await this.db.query(query, valores);

      if (!result.rows[0]) {
        throw new HttpException(
          {
            message: `No se encuentra registro con este ID: ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Usuario actualizado exitosamente',
        data: result.rows[0],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error al actualizar usuario:', error);

      // Manejar errores específicos de restricciones de base de datos
      if (
        error.message &&
        error.message.includes('llave duplicada viola restricción de unicidad')
      ) {
        if (error.message.includes('usuario_telefono_key')) {
          throw new HttpException(
            {
              message:
                'El número de teléfono ya está registrado por otro usuario',
              field: 'telefono',
            },
            HttpStatus.CONFLICT,
          );
        }
        if (error.message.includes('usuario_email_key')) {
          throw new HttpException(
            {
              message: 'El email ya está registrado por otro usuario',
              field: 'email',
            },
            HttpStatus.CONFLICT,
          );
        }
        // Error genérico para otras restricciones de unicidad
        throw new HttpException(
          {
            message: 'Ya existe un registro con estos datos',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          message: 'Error al actualizar el usuario',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // eliminar un usuario, lo hace mediante el id
  async eliminar(id: number) {
    const query = `
          DELETE FROM usuario
          WHERE id_usuario = $1 
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

  // Cambiar tipo y crear perfil asociado de forma atómica (best-effort)
  async cambiarTipoConPerfil(
    id_usuario: number,
    body: {
      nuevo_tipo: number; // 1 prestamista, 2 prestatario
      capital?: number;
      nombre_negocio?: string;
      ingreso_mensual?: number;
      id_direccion?: number;
    },
  ) {
    const { nuevo_tipo } = body;
    if (![1, 2].includes(nuevo_tipo)) {
      throw new HttpException(
        { message: 'Tipo inválido. Use 1 (prestamista) o 2 (prestatario).' },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.actualizar(id_usuario, { id_tipo: nuevo_tipo });
    if (nuevo_tipo === 1) {
      await this.prestamistaService.crearConRangoInicial({
        id_prestamista: id_usuario,
        capital: body.capital ?? 0,
        estado: true,
      });
    } else if (nuevo_tipo === 2) {
      await this.prestatarioService.crear({
        id_prestatario: id_usuario,
        nombre_negocio: body.nombre_negocio || `Negocio-${id_usuario}`,
        id_direccion: body.id_direccion || 1,
        ingreso_mensual: body.ingreso_mensual || 0,
        calificacion_crediticia: 0,
        estado: true,
      });
    }
    return { message: 'Tipo actualizado y perfil asociado creado', nuevo_tipo };
  }
  //#########################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################

  //
  // async obtenerUsuariosDetallado(id: number) {
  //   const extra = await this.obtenerPorId(id);
  //   const query = `
  //                   SELECT
  //                     u.id_usuario,
  //                     u.nombre,
  //                     u.apellido,
  //                     u.telefono,
  //                     u.fecha_nacimiento,
  //                     u.email,
  //                     d.calle1,
  //                     d.calle2,
  //                     b.nombre_barrio,
  //                     c.nombre_ciudad
  //                   FROM usuario u
  //                   JOIN direccion d ON u.id_direccion = d.id_direccion
  //                   JOIN barrio b ON d.id_barrio = b.id_barrio
  //                   JOIN ciudad c ON b.id_ciudad = c.id_ciudad
  //                   WHERE u.id_usuario=$1 AND u.estado = true;
  //                 `;
  //   try {
  //     const result = await this.db.query(query, [id]);
  //     return result.rows[0];
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         message: 'Error al obtener usuarios detallados',
  //         error: error.message,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
