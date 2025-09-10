import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { FirstAccessDto } from './dto/first-access.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Post('register')
  // @ApiOperation({ summary: 'Registro de novo usuário' })
  // @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  // @ApiResponse({ status: 400, description: 'Dados inválidos' })
  // @ApiResponse({ status: 409, description: 'Email já existe' })
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.register(createUserDto);
  // }

  @Public()
  @Post('first-access')
  @HttpCode(200)
  @ApiOperation({ summary: 'Primeiro acesso' })
  @ApiResponse({ status: 200, description: 'Primeiro acesso realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async firstAccess(@Body() firstAccessDto: FirstAccessDto) {
    return this.authService.firstAccess(firstAccessDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Renovar token JWT' })
  @ApiResponse({ status: 200, description: 'Token renovado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiBearerAuth()
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.sub);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
