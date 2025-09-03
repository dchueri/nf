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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { TeamRole } from './schemas/team.schema';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
@ApiExtraModels(ResponseDto)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar nova empresa' })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ResponseMessage('Empresa criada com sucesso')
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companiesService.create(
      createCompanyDto,
      req.user.sub
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  findAll(@Request() req) {
    return this.companiesService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter empresa por ID' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.companiesService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({ status: 200, description: 'Equipe atualizada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: Partial<CreateCompanyDto>,
    @Request() req
  ) {
    return this.companiesService.update(id, updateTeamDto, req.user.companyId);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Remover empresa' })
  @ApiResponse({ status: 200, description: 'Empresa removida' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  remove(@Param('id') id: string, @Request() req) {
    return this.companiesService.remove(id, req.user.companyId);
  }

  @Post(':id/members')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Adicionar membro à empresa' })
  @ApiResponse({ status: 200, description: 'Membro adicionado' })
  @ApiResponse({ status: 400, description: 'Usuário já é membro' })
  @ApiResponse({ status: 404, description: 'Empresa ou usuário não encontrado' })
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role: TeamRole },
    @Request() req
  ) {
    return this.companiesService.addMember(
      id,
      body.userId,
      body.role,
      req.user.companyId
    );
  }

  @Delete(':id/members/:userId')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Remover membro da empresa' })
  @ApiResponse({ status: 200, description: 'Membro removido' })
  @ApiResponse({ status: 400, description: 'Não é possível remover o proprietário' })
  @ApiResponse({ status: 404, description: 'Empresa ou membro não encontrado' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req
  ) {
    return this.companiesService.removeMember(id, userId, req.user.companyId);
  }

  @Patch(':id/members/:userId/role')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar função do membro da empresa' })
  @ApiResponse({ status: 200, description: 'Função atualizada' })
  @ApiResponse({ status: 400, description: 'Não é possível alterar a função do proprietário' })
  @ApiResponse({ status: 404, description: 'Empresa ou membro não encontrado' })
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: TeamRole },
    @Request() req
  ) {
    return this.companiesService.updateMemberRole(
      id,
      userId,
      body.role,
      req.user.companyId
    );
  }

  @Get(':id/stats')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter estatísticas da empresa' })
  @ApiResponse({ status: 200, description: 'Estatísticas da empresa' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  getTeamStats(@Param('id') id: string, @Request() req) {
    return this.companiesService.getTeamStats(id, req.user.companyId);
  }

  @Get(':id/activities')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter atividades da empresa' })
  @ApiResponse({ status: 200, description: 'Atividades da empresa' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  getTeamActivities(
    @Param('id') id: string,
    @Query('limit') limit: string,
    @Request() req
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.companiesService.getTeamActivities(id, limitNum);
  }
}
