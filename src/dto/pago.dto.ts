import { ApiProperty } from '@nestjs/swagger';

export class PagoCreateDto {
  @ApiProperty({ example: 100, description: 'ID del préstamo' })
  id_prestamo!: number;

  @ApiProperty({ example: 2, description: 'ID del método de pago' })
  id_metodo!: number;

  @ApiProperty({ example: 150.5 })
  monto_pagado!: number;

  @ApiProperty({ example: '2025-08-14' })
  fecha_pago!: string;

  @ApiProperty({ example: true })
  estado!: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Archivo comprobante',
  })
  comprobante!: any;
}
