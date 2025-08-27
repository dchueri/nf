import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { TeamRole } from './schemas/team.schema';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Criar nova equipe' })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(
      createTeamDto,
      req.user.companyId,
      req.user.sub
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as equipes da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de equipes' })
  findAll(@Request() req) {
    return this.teamsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter equipe por ID' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.teamsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar equipe' })
  @ApiResponse({ status: 200, description: 'Equipe atualizada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: Partial<CreateTeamDto>,
    @Request() req
  ) {
    return this.teamsService.update(id, updateTeamDto, req.user.companyId);
  }

  @Delete(':id')
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Remover equipe' })
  @ApiResponse({ status: 200, description: 'Equipe removida' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  remove(@Param('id') id: string, @Request() req) {
    return this.teamsService.remove(id, req.user.companyId);
  }

  @Post(':id/members')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Adicionar membro à equipe' })
  @ApiResponse({ status: 200, description: 'Membro adicionado' })
  @ApiResponse({ status: 400, description: 'Usuário já é membro' })
  @ApiResponse({ status: 404, description: 'Equipe ou usuário não encontrado' })
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role: TeamRole },
    @Request() req
  ) {
    return this.teamsService.addMember(
      id,
      body.userId,
      body.role,
      req.user.companyId
    );
  }

  @Delete(':id/members/:userId')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Remover membro da equipe' })
  @ApiResponse({ status: 200, description: 'Membro removido' })
  @ApiResponse({ status: 400, description: 'Não é possível remover o proprietário' })
  @ApiResponse({ status: 404, description: 'Equipe ou membro não encontrado' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req
  ) {
    return this.teamsService.removeMember(id, userId, req.user.companyId);
  }

  @Patch(':id/members/:userId/role')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar função do membro' })
  @ApiResponse({ status: 200, description: 'Função atualizada' })
  @ApiResponse({ status: 400, description: 'Não é possível alterar a função do proprietário' })
  @ApiResponse({ status: 404, description: 'Equipe ou membro não encontrado' })
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: TeamRole },
    @Request() req
  ) {
    return this.teamsService.updateMemberRole(
      id,
      userId,
      body.role,
      req.user.companyId
    );
  }

  @Get(':id/stats')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter estatísticas da equipe' })
  @ApiResponse({ status: 200, description: 'Estatísticas da equipe' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  getTeamStats(@Param('id') id: string, @Request() req) {
    return this.teamsService.getTeamStats(id, req.user.companyId);
  }

  @Get(':id/activities')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter atividades da equipe' })
  @ApiResponse({ status: 200, description: 'Atividades da equipe' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  getTeamActivities(
    @Param('id') id: string,
    @Query('limit') limit: string,
    @Request() req
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.teamsService.getTeamActivities(id, limitNum);
  }
}
