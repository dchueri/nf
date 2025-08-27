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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResourceAccess } from '../auth/decorators/resource-access.decorator';
import { UserRole } from './schemas/user.schema';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.COMPANY)
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
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Listar todos os usuários da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(@Request() req) {
    return this.usersService.findByCompany(req.user.companyId);
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
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('invite')
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Convidar colaborador' })
  @ApiResponse({ status: 201, description: 'Convite enviado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  inviteCollaborator(
    @Body() body: { email: string },
    @Request() req
  ) {
    return this.usersService.inviteCollaborator(
      body.email,
      req.user.companyId,
      req.user.sub
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.usersService.updateStatus(id, body.status);
  }
}
