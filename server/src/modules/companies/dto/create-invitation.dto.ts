import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamRole } from '../schemas/team.schema';

export class CreateInvitationDto {
  @ApiProperty({ description: 'Email do usuário convidado' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Nome do usuário convidado', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'ID da equipe (opcional)', required: false })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiProperty({ description: 'Função do usuário na equipe' })
  @IsEnum(TeamRole)
  role: TeamRole;

  @ApiProperty({ description: 'Data de expiração do convite' })
  @IsDateString()
  expiresAt: string;

  @ApiProperty({ description: 'Mensagem personalizada do convite', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'IDs das equipes para adicionar o usuário', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teamIds?: string[];
}
