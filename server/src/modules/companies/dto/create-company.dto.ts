import { IsString, IsOptional, IsEmail, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanySettings } from '../schemas/company.schema';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Nome da equipe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'CNPJ da empresa' })
  @IsString()
  cnpj: string;

  @ApiProperty({ description: 'Endereço da empresa' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Cidade da empresa' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado da empresa' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'CEP da empresa' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'Telefone da empresa' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email da empresa' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Configurações da empresa' })
  @IsOptional()
  @IsObject()
  settings?: CompanySettings;
}
