import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamPrivacy, TeamRole } from '../schemas/team.schema';

export class TeamSettingsDto {
  @ApiProperty({ description: 'Permitir convites de membros' })
  @IsBoolean()
  allowMemberInvites: boolean;

  @ApiProperty({ description: 'Requer aprovação para novos membros' })
  @IsBoolean()
  requireApproval: boolean;

  @ApiProperty({ description: 'Função padrão para novos membros' })
  @IsEnum(TeamRole)
  defaultRole: TeamRole;

  @ApiProperty({ description: 'Número máximo de membros' })
  @IsNumber()
  maxMembers: number;

  @ApiProperty({ description: 'Nível de privacidade da equipe' })
  @IsEnum(TeamPrivacy)
  privacy: TeamPrivacy;
}

export class CreateTeamDto {
  @ApiProperty({ description: 'Nome da equipe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da equipe', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Configurações da equipe' })
  settings: TeamSettingsDto;

  @ApiProperty({ description: 'IDs dos membros iniciais', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];
}
