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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
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
    return this.companiesService.create(createCompanyDto, req.user.sub);
  }

  @Get('my')
  @ApiOperation({ summary: 'Obter empresa do usuário logado' })
  @ApiResponse({ status: 200, description: 'Empresa do usuário logado' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findMyCompany(@Request() req) {
    return this.companiesService.findOneById(req.user.companyId);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({ status: 200, description: 'Equipe atualizada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
    @Request() req,
  ) {
    return this.companiesService.update(req.user.companyId, updateCompanyDto);
  }
}
