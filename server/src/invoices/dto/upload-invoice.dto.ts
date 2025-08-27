import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadInvoiceDto {
  @ApiProperty({
    description: 'Número da nota fiscal',
    example: 'NF-001/2024',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Número da nota fiscal deve ser uma string' })
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Data de emissão da nota fiscal',
    example: '2024-01-15',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Data de emissão deve ser uma string' })
  issueDate?: string;

  @ApiProperty({
    description: 'Data de vencimento da nota fiscal',
    example: '2024-01-31',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Data de vencimento deve ser uma string' })
  dueDate?: string;

  @ApiProperty({
    description: 'Valor da nota fiscal',
    example: '1500.00',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Valor deve ser uma string' })
  amount?: string;

  @ApiProperty({
    description: 'Descrição dos serviços/produtos',
    example: 'Desenvolvimento de software - Janeiro 2024',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Nota fiscal referente ao projeto X',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @ApiProperty({
    description: 'Tags para categorização',
    example: ['desenvolvimento', 'software', 'janeiro'],
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'Tags devem ser um array' })
  tags?: string[];
}
