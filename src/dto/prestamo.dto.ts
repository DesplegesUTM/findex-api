import { ApiProperty } from '@nestjs/swagger';

export class PrestamoCreateDto {
  @ApiProperty({ example: 10 })
  id_oferta!: number;

  @ApiProperty({ example: 25 })
  id_prestatario!: number;

  @ApiProperty({ example: '2025-09-01' })
  fecha_inicio!: string;

  @ApiProperty({ example: '2026-09-01' })
  fecha_fin!: string;

  @ApiProperty({ example: true })
  estado!: boolean;
}
