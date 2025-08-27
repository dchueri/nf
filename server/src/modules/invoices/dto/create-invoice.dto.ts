import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsMongoId, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceType } from '../schemas/invoice.schema';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Número da nota fiscal',
    example: 'NF-001/2024'
  })
  @IsString({ message: 'Número da nota fiscal deve ser uma string' })
  @MaxLength(50, { message: 'Número da nota fiscal deve ter no máximo 50 caracteres' })
  invoiceNumber: string;

  @ApiProperty({
    description: 'Data de emissão da nota fiscal',
    example: '2024-01-15'
  })
  @IsDateString({}, { message: 'Data de emissão deve ser uma data válida' })
  issueDate: string;

  @ApiProperty({
    description: 'Data de vencimento da nota fiscal',
    example: '2024-01-31'
  })
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  dueDate: string;

  @ApiProperty({
    description: 'Valor da nota fiscal',
    example: 1500.00,
    minimum: 0
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor deve ser maior ou igual a zero' })
  amount: number;

  @ApiProperty({
    description: 'Descrição dos serviços/produtos',
    example: 'Desenvolvimento de software - Janeiro 2024'
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Tipo da nota fiscal',
    enum: InvoiceType,
    example: InvoiceType.INVOICE
  })
  @IsEnum(InvoiceType, { message: 'Tipo deve ser válido' })
  type: InvoiceType;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Nota fiscal referente ao projeto X',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  @MaxLength(1000, { message: 'Observações devem ter no máximo 1000 caracteres' })
  notes?: string;

  @ApiProperty({
    description: 'Tags para categorização',
    example: ['desenvolvimento', 'software', 'janeiro'],
    required: false
  })
  @IsOptional()
  tags?: string[];
}
