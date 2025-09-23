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
  Req,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole, UserStatus } from './schemas/user.schema';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { InviteUserDto } from './dto/invite-user.dto';
import { BulkUpdateUserDto } from './dto/bulk-update-user.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(ResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    if (
      createUserDto.role === UserRole.COLLABORATOR &&
      !createUserDto.companyId
    ) {
      createUserDto.companyId = req.user.companyId;
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Listar todos os usuários da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: UserStatus,
    @Query('role') role: UserRole,
  ) {
    const authorId = req.user._id;
    return this.usersService.findByCompanyPaginated(
      req.user.companyId,
      page,
      limit,
      search,
      status,
      role,
      authorId,
    );
  }

  @Get('stats/:referenceMonth')
  @ApiOperation({
    summary: 'Obter estatísticas dos usuários por mês de referência',
  })
  @ApiResponse({ status: 200, description: 'Estatísticas dos usuários' })
  @ResponseMessage('Estatísticas dos usuários obtidas com sucesso')
  getStats(@Request() req, @Param('referenceMonth') referenceMonth: string) {
    const user = req.user;
    if (user.role === UserRole.MANAGER) {
      return this.usersService.getUsersStatsByMonth(
        user.companyId,
        referenceMonth,
      );
    } else {
      return this.usersService.getOneUserStatsByMonth(user, referenceMonth);
    }
  }

  @Get('invoice-status')
  @ApiOperation({ summary: 'Obter status das faturas dos usuários' })
  @ApiResponse({ status: 200, description: 'Status das faturas dos usuários' })
  getInvoiceStatus(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: UserStatus,
    @Query('referenceMonth') referenceMonth: string,
  ) {
    return this.usersService.getUsersWithInvoiceStatus(
      req.user.companyId,
      referenceMonth,
      status,
      search,
      page,
      limit,
    );
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.updateWithAuth(req.user._id, updateUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateWithAuth(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('invite/validate')
  @Public()
  @HttpCode(204)
  @ApiOperation({ summary: 'Validar convite do usuário' })
  @ApiResponse({ status: 204, description: 'Convite validado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  validateInvite(@Body() body: { email: string }) {
    return this.usersService.validateInvite(body.email);
  }

  @Post('invite')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Convidar colaborador' })
  @ApiResponse({ status: 201, description: 'Convite enviado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  inviteCollaborator(@Body() body: InviteUserDto, @Request() req) {
    return this.usersService.inviteCollaborator(body.email, req.user.companyId);
  }

  @Delete('invite/:userId')
  @ApiOperation({ summary: 'Cancelar convite' })
  @ApiResponse({ status: 204, description: 'Convite cancelado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  cancelInvitation(@Param('userId') userId: string, @Request() req) {
    return this.usersService.cancelInvitation(userId, req.user.companyId);
  }

  @Patch('bulk/status')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar status dos usuários' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  bulkUpdateStatus(@Body() body: BulkUpdateUserDto) {
    return this.usersService.bulkUpdateStatus(body.userIds, body.status);
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.usersService.updateStatus(id, body.status);
  }
}
