import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    // Permitir ambos nombres de variable BD_DATABASE o DB_DATABASE para evitar fallos de configuración
    const databaseName = process.env.BD_DATABASE || process.env.DB_DATABASE;
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    // imprime por consola paa verificar los datos de la conexion a la base de datos.
    console.log('[DatabaseService] Variables de conexión cargadas:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: databaseName,
      user: process.env.DB_USER,
      hasPassword: !!process.env.DB_PASSWORD,
    });
  }
  async query(querytext: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(querytext, params);
      //console.log(`Consulta ejecutada: ${querytext}`);
      return result;
    } catch (err) {
      console.error('[DatabaseService] Error en query:', {
        query: querytext,
        params,
        error: err.message,
      });
      throw new Error(`Error al ejecutar la consulta: ${err.message}`);
    } finally {
      client.release();
    }
  }
}
