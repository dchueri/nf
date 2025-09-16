import { PartialType } from '@nestjs/swagger';
import { UploadInvoiceDto } from './upload-invoice.dto';

export class UpdateInvoiceDto extends PartialType(UploadInvoiceDto) {}
