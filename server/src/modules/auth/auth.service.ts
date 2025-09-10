import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserStatus } from '../users/schemas/user.schema';
import { comparePassword, hashPassword } from '../../utils/crypt';
import { FirstAccessDto } from './dto/first-access.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async firstAccess(firstAccessDto: FirstAccessDto) {
    const user = await this.usersService.findByEmail(firstAccessDto.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userData = {
      ...firstAccessDto,
      status: UserStatus.ACTIVE,
    };

    const updatedUser = await this.usersService.update(
      user._id.toString(),
      userData,
    );
    return this.generateLoginResponse(updatedUser);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException(
        'Usuário suspenso, entre em contato com o administrador',
      );
    }
    if (user && (await comparePassword(password, user.password))) {
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

    return this.generateLoginResponse(user);
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Usuário com este email já existe');
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.usersService.create(userData);

    return this.generateLoginResponse(user);
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload = this.getPayload(user);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private generateLoginResponse(user: User) {
    const payload = this.getPayload(user);
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

  private getPayload(user: User) {
    return {
      email: user.email,
      sub: user._id,
      role: user.role,
      companyId: user.companyId,
    };
  }
}
