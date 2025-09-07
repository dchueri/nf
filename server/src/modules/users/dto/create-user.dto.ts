import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@empresa.com',
  })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: UserRole,
    example: UserRole.COLLABORATOR,
  })
  @IsEnum(UserRole, { message: 'Role deve ser válido' })
  @IsOptional()
  role: UserRole;

  @ApiProperty({
    description: 'ID da empresa (opcional para colaboradores)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'ID da empresa deve ser válido' })
  companyId?: string;

  @ApiProperty({
    description: 'Departamento do usuário',
    example: 'Departamento de Vendas',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Departamento deve ser uma string' })
  department?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+55 48 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  phone?: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do usuário',
    example: '123.456.789-00',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CPF/CNPJ deve ser uma string' })
  cpfCnpj?: string;

  @ApiProperty({
    description: 'ID do usuário que convidou (opcional)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'ID do usuário convidador deve ser válido' })
  invitedBy?: string;

  @ApiProperty({
    description: 'Status do usuário',
    enum: UserStatus,
    example: 'pending',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status deve ser válido' })
  status?: UserStatus;
}
