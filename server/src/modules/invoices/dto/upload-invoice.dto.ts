import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadInvoiceDto {
  @ApiProperty({
    description: 'Número da nota fiscal',
    example: 'NF-001/2024',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Número da nota fiscal deve ser uma string' })
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Mês de referência da nota fiscal',
    example: '2024-01',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mês de referência deve ser uma string' })
  referenceMonth?: string;
}
