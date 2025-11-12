import { ApiProperty } from '@nestjs/swagger';

export class OfertaPrestamoCreateDto {
  @ApiProperty({ example: 1 })
  id_prestamista!: number;

  @ApiProperty({ example: 'oferta-abc123' })
  codigo_oferta!: string;

  @ApiProperty({ example: 1000 })
  monto!: number;

  @ApiProperty({ example: 10, description: 'Porcentaje anual' })
  tasa_interes!: number;

  @ApiProperty({ example: 4, description: 'ID de frecuencia de pago' })
  id_frecuencia!: number;

  @ApiProperty({ example: 12 })
  nro_cuotas!: number;

  @ApiProperty({ example: 100 })
  monto_cuota!: number;

  @ApiProperty({ example: '2025-08-14' })
  fecha_publicacion!: string;

  @ApiProperty({ example: true })
  estado!: boolean;
}

export class OfertaPrestamoUpdateDto {
  @ApiProperty({ example: 1000 })
  monto!: number;

  @ApiProperty({ example: 10 })
  tasa_interes!: number;

  @ApiProperty({ example: 4 })
  id_frecuencia!: number;

  @ApiProperty({ example: 12 })
  nro_cuotas!: number;

  @ApiProperty({ example: 100 })
  monto_cuota!: number;

  @ApiProperty({ example: true })
  estado!: boolean;
}
