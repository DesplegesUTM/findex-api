import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SolicitudPrestamoService {
  constructor(private readonly db: DatabaseService) {}

  async crear(body: any) {
    const { id_oferta, id_prestatario, monto_solicitado, comentario } = body;
    if (!id_oferta || !id_prestatario) {
      throw new HttpException(
        { message: 'id_oferta e id_prestatario requeridos' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const dup = await this.db.query(
      "SELECT 1 FROM solicitud_prestamo WHERE id_oferta=$1 AND id_prestatario=$2 AND estado IN ('pendiente','aceptada')",
      [id_oferta, id_prestatario],
    );
    if (dup.rows.length) {
      throw new HttpException(
        { message: 'Ya aplicaste a esta oferta' },
        HttpStatus.CONFLICT,
      );
    }
    const oferta = await this.db.query(
      'SELECT * FROM oferta_prestamo WHERE id_oferta=$1 AND estado = true',
      [id_oferta],
    );
    if (!oferta.rows.length) {
      throw new HttpException(
        { message: 'Oferta no activa o inexistente' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // obtener contacto del prestatario (usuario)
    const contacto = await this.db.query(
      'SELECT telefono, email FROM usuario WHERE id_usuario=$1',
      [id_prestatario],
    );
    let comentarioFinal =
      comentario && comentario.trim().length > 0
        ? comentario.trim() + ' | '
        : '';
    if (contacto.rows.length) {
      const { telefono, email } = contacto.rows[0];
      comentarioFinal += `Tel: ${telefono || 'N/D'} | Email: ${email || 'N/D'}`;
    } else {
      comentarioFinal += 'Contacto no disponible';
    }
    const result = await this.db.query(
      `INSERT INTO solicitud_prestamo (id_oferta,id_prestatario,monto_solicitado,comentario) VALUES($1,$2,$3,$4) RETURNING *`,
      [id_oferta, id_prestatario, monto_solicitado, comentarioFinal],
    );
    return result.rows[0];
  }

  async listarPorOferta(id_oferta: number) {
    const res = await this.db.query(
      `SELECT sp.*, u.nombre, u.apellido, u.telefono, u.email FROM solicitud_prestamo sp JOIN prestatario pr ON sp.id_prestatario=pr.id_prestatario JOIN usuario u ON u.id_usuario=pr.id_prestatario WHERE sp.id_oferta=$1 ORDER BY sp.fecha_creacion DESC`,
      [id_oferta],
    );
    return res.rows;
  }

  async listarPorPrestamista(id_prestamista: number) {
    const query = `SELECT sp.*, u.nombre, u.apellido, u.telefono, u.email, o.codigo_oferta
                   FROM solicitud_prestamo sp
                   JOIN oferta_prestamo o ON sp.id_oferta = o.id_oferta
                   JOIN prestatario pr ON sp.id_prestatario = pr.id_prestatario
                   JOIN usuario u ON pr.id_prestatario = u.id_usuario
                   WHERE o.id_prestamista = $1
                   ORDER BY sp.fecha_creacion DESC`;
    const res = await this.db.query(query, [id_prestamista]);
    return res.rows;
  }

  async yaAplico(id_oferta: number, id_prestatario: number) {
    const q = await this.db.query(
      "SELECT estado FROM solicitud_prestamo WHERE id_oferta=$1 AND id_prestatario=$2 AND estado IN('pendiente','aceptada') LIMIT 1",
      [id_oferta, id_prestatario],
    );
    return { yaAplico: q.rows.length > 0, estado: q.rows[0]?.estado };
  }

  async aceptar(id_solicitud: number) {
    const sol = await this.db.query(
      'SELECT * FROM solicitud_prestamo WHERE id_solicitud=$1',
      [id_solicitud],
    );
    if (!sol.rows.length)
      throw new HttpException(
        { message: 'Solicitud no encontrada' },
        HttpStatus.NOT_FOUND,
      );
    const solicitud = sol.rows[0];
    if (solicitud.estado !== 'pendiente')
      throw new HttpException(
        { message: 'Solicitud ya procesada' },
        HttpStatus.BAD_REQUEST,
      );
    const oferta = await this.db.query(
      'SELECT * FROM oferta_prestamo WHERE id_oferta=$1 AND estado=true',
      [solicitud.id_oferta],
    );
    if (!oferta.rows.length)
      throw new HttpException(
        { message: 'Oferta no activa' },
        HttpStatus.BAD_REQUEST,
      );

    const fecha_inicio = new Date();
    const fecha_fin = new Date();
    fecha_fin.setMonth(fecha_fin.getMonth() + 6);
    const prestamo = await this.db.query(
      `INSERT INTO prestamo (id_oferta,id_prestatario,fecha_inicio,fecha_fin,estado) VALUES($1,$2,$3,$4,true) RETURNING *`,
      [solicitud.id_oferta, solicitud.id_prestatario, fecha_inicio, fecha_fin],
    );
    await this.db.query(
      "UPDATE solicitud_prestamo SET estado='aceptada' WHERE id_solicitud=$1",
      [id_solicitud],
    );
    return { mensaje: 'Solicitud aceptada', prestamo: prestamo.rows[0] };
  }

  async rechazar(id_solicitud: number) {
    const sol = await this.db.query(
      'SELECT * FROM solicitud_prestamo WHERE id_solicitud=$1',
      [id_solicitud],
    );
    if (!sol.rows.length)
      throw new HttpException(
        { message: 'Solicitud no encontrada' },
        HttpStatus.NOT_FOUND,
      );
    if (sol.rows[0].estado !== 'pendiente')
      throw new HttpException(
        { message: 'Solicitud ya procesada' },
        HttpStatus.BAD_REQUEST,
      );
    await this.db.query(
      "UPDATE solicitud_prestamo SET estado='rechazada' WHERE id_solicitud=$1",
      [id_solicitud],
    );
    return { mensaje: 'Solicitud rechazada' };
  }
}
