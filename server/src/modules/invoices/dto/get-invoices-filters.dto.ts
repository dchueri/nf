import { IsNumber, IsOptional, IsString } from 'class-validator';
import { InvoiceStatus } from '../schemas/invoice.schema';

export class GetInvoicesFiltersDto {
  @IsOptional()
  page: number = 1;

  @IsOptional()
  limit: number = 10;

  @IsOptional()
  @IsString()
  referenceMonth?: string;

  @IsOptional()
  @IsString()
  status?: InvoiceStatus;

  @IsOptional()
  @IsString()
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}