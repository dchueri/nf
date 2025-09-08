import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from '../users/schemas/user.schema';
import { comparePassword, hashPassword } from '../../utils/crypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Usuário suspenso, entre em contato com o administrador');
    }
    if (user && await comparePassword(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.usersService.updateLastLogin(user._id);

    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role,
      companyId: user.companyId 
    };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        status: user.status,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Usuário com este email já existe');
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.usersService.create(userData);

    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role,
      companyId: user.companyId 
    };

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        status: user.status,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role,
      companyId: user.companyId 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
