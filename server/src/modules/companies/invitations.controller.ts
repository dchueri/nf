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
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
@ApiBearerAuth()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar novo convite' })
  @ApiResponse({ status: 201, description: 'Convite criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Convite já existe para este email' })
  create(@Body() createInvitationDto: CreateInvitationDto, @Request() req) {
    return this.invitationsService.create(
      createInvitationDto,
      req.user.companyId,
      req.user.sub
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os convites da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de convites' })
  findAll(@Request() req) {
    return this.invitationsService.findAll(req.user.companyId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Listar convites pendentes da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de convites pendentes' })
  getPendingInvitations(@Request() req) {
    return this.invitationsService.getPendingInvitations(req.user.companyId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos convites' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos convites' })
  getInvitationStats(@Request() req) {
    return this.invitationsService.getInvitationStats(req.user.companyId);
  }

  @Get(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter convite por ID' })
  @ApiResponse({ status: 200, description: 'Convite encontrado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.invitationsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar convite' })
  @ApiResponse({ status: 200, description: 'Convite atualizado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: Partial<CreateInvitationDto>,
    @Request() req
  ) {
    return this.invitationsService.update(id, updateInvitationDto, req.user.companyId);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancelar convite' })
  @ApiResponse({ status: 200, description: 'Convite cancelado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.invitationsService.cancel(id, req.user.companyId);
  }

  @Post(':id/resend')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Reenviar convite' })
  @ApiResponse({ status: 200, description: 'Convite reenviado' })
  @ApiResponse({ status: 400, description: 'Convite não está mais válido' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  resend(@Param('id') id: string, @Request() req) {
    return this.invitationsService.resend(id, req.user.companyId);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Aceitar convite' })
  @ApiResponse({ status: 200, description: 'Convite aceito' })
  @ApiResponse({ status: 400, description: 'Convite não está mais válido' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  accept(@Param('id') id: string, @Request() req) {
    return this.invitationsService.accept(id, req.user.sub);
  }

  @Post(':id/decline')
  @ApiOperation({ summary: 'Recusar convite' })
  @ApiResponse({ status: 200, description: 'Convite recusado' })
  @ApiResponse({ status: 400, description: 'Convite não está mais válido' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  decline(@Param('id') id: string) {
    return this.invitationsService.decline(id);
  }

  @Get('search/email')
  @ApiOperation({ summary: 'Buscar convites por email' })
  @ApiResponse({ status: 200, description: 'Convites encontrados' })
  findByEmail(@Query('email') email: string, @Request() req) {
    return this.invitationsService.findByEmail(email, req.user.companyId);
  }
}
