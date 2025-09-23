import { PartialType } from '@nestjs/swagger';
import { UploadInvoiceDto } from './upload-invoice.dto';
import { InvoiceStatus } from '../schemas/invoice.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(UploadInvoiceDto) {
  @ApiProperty({
    description: 'Status da nota fiscal',
    example: InvoiceStatus.IGNORED,
    enum: InvoiceStatus,
    required: true,
  })
  @IsString()
  status: InvoiceStatus;
}
