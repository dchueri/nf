import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIgnoredInvoiceDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'Mês de referência da nota fiscal',
    example: '2024-01',
    required: true,
  })
  @IsString()
  referenceMonth: string;
}
