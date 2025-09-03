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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { UserRole, UserStatus } from './schemas/user.schema';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { InviteUserDto } from './dto/invite-user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
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
    if (createUserDto.role === UserRole.COLLABORATOR && !createUserDto.companyId) {
      createUserDto.companyId = req.user.companyId;
    }
    
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Listar todos os usuários da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(@Request() req, @Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string, @Query('status') status: UserStatus, @Query('role') role: UserRole) {
    return this.usersService.findByCompanyPaginated(req.user.companyId, page, limit, search, status, role);
  }

  @Get('stats/:referenceMonth')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Obter estatísticas dos usuários por mês de referência' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos usuários' })
  @ResponseMessage('Estatísticas dos usuários obtidas com sucesso')
  getStats(@Request() req, @Param('referenceMonth') referenceMonth: string) {
    return this.usersService.getUsersStatsByMonth(req.user.companyId, referenceMonth);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Get(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('invite')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Convidar colaborador' })
  @ApiResponse({ status: 201, description: 'Convite enviado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  inviteCollaborator(
    @Body() body: InviteUserDto,
    @Request() req
  ) {
    return this.usersService.inviteCollaborator(
      body.email,
      req.user.companyId
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.usersService.updateStatus(id, body.status);
  }
}
