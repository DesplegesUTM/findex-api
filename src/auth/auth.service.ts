import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { API_DOCUMENTATION_MESSAGE } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}
  private jwtSecret = process.env.JWT_SECRET || 'secretfindex';

  async login(body: any) {
    const { email, contraseña } = body;

    if (!email || !contraseña) {
      throw new HttpException(
        { message: API_DOCUMENTATION_MESSAGE },
        HttpStatus.BAD_REQUEST,
      );
    }

    const query = 'SELECT * FROM usuario WHERE email = $1;';
    let user: any;
    try {
      const result = await this.db.query(query, [email]);
      user = result.rows[0];
    } catch (e) {
      console.error(
        '[AuthService.login] Error consultando usuario:',
        e.message,
      );
      throw new HttpException(
        { message: 'Error interno al verificar usuario' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      throw new HttpException(
        { message: 'Usuario no encontrado' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.estado) {
      throw new HttpException(
        { message: 'Usuario inactivo o bloqueado' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    let validPassword = false;
    try {
      validPassword = await bcrypt.compare(contraseña, user.contraseña);
    } catch (e) {
      console.error(
        '[AuthService.login] Error comparando contraseña:',
        e.message,
      );
      throw new HttpException(
        { message: 'Error interno al validar credenciales' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!validPassword) {
      throw new HttpException(
        { message: 'Contraseña incorrecta' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: user.id_usuario,
      tipo: user.id_tipo,
    };

    let token: string;
    try {
      token = jwt.sign(payload, this.jwtSecret, { expiresIn: '2h' });
    } catch (e) {
      console.error('[AuthService.login] Error firmando token:', e.message);
      throw new HttpException(
        { message: 'Error interno al generar token' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        tipo: user.id_tipo,
      },
    };
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new HttpException(
        { message: 'Token inválido o expirado' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Registrar un nuevo usuario

  async register(body: any) {
    const { email, contraseña } = body;
    if (!email || !contraseña) {
      throw new HttpException(
        {
          message: API_DOCUMENTATION_MESSAGE,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //  verificar si el usuario ya existe en la base de datos
    const existsQuery = 'SELECT * FROM usuario WHERE email= $1;';
    const existsResult = await this.db.query(existsQuery, [email]);
    if (existsResult.rows.length > 0) {
      throw new HttpException(
        {
          message:
            'Este correo electrónico ya está registrado. Intenta con otro email o inicia sesión.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const contraseñaHash = await this.hashPassword(contraseña);

    const insertQuery = `INSERT INTO usuario (
      email, contraseña, estado, fecha_registro, id_tipo
    ) VALUES ($1, $2, $3, NOW(), $4) RETURNING *;`;
    const values = [email, contraseñaHash, true, 2];

    try {
      const result = await this.db.query(insertQuery, values);
      const nuevoUsuario = result.rows[0];

      // No crear registro automático en prestatario/prestamista
      // El usuario completará su perfil más tarde

      return {
        message: 'Usuario registrado exitosamente',
        user: {
          id: nuevoUsuario.id_usuario,
          email: nuevoUsuario.email,
          tipo: nuevoUsuario.id_tipo,
        },
      };
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error al registrar el usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
