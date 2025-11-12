import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(
        'Token no proporcionado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secretfindex',
      );
      request.user = payload; // Inyectamos el payload en la request
      return true;
    } catch (err) {
      throw new HttpException(
        'Token inválido o expirado',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
