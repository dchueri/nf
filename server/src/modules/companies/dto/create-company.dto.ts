import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamPrivacy, TeamRole } from '../schemas/team.schema';

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
  settings?: {
    reminderSchedule: {
      firstReminder: number;
      secondReminder: number;
      finalReminder: number;
      escalationReminder: number;
    };
    invoiceDeadline: number;
    autoReminders: boolean;
    emailNotifications: boolean;
    deadline: {
      strategy: 'fixed_day' | 'start_month' | 'end_month';
      day: number;
      daysFromStart: number;
      daysFromEnd: number;
    };
  };
}
