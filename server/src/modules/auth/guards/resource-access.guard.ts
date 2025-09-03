import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';

export interface ResourceAccessOptions {
  allowOwnResource?: boolean; // Se true, usuário pode acessar seu próprio recurso
  allowCompanyResource?: boolean; // Se true, empresa pode acessar recursos da empresa
  resourceParamName?: string; // Nome do parâmetro que contém o ID do recurso
}

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.get<ResourceAccessOptions>('resourceAccess', context.getHandler());
    
    if (!options) {
      return true; // Se não há configuração, permite acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params[options.resourceParamName || 'id'];

    if (!user || !resourceId) {
      return true; // Se não há usuário ou ID do recurso, deixa outros guards decidirem
    }

    // Colaboradores só podem acessar seus próprios recursos
    if (user.role === UserRole.COLLABORATOR) {
      if (options.allowOwnResource && user.sub === resourceId) {
        return true;
      }
      throw new ForbiddenException('Acesso negado: Colaboradores só podem acessar seus próprios recursos');
    }

    // Empresas podem acessar recursos da empresa se permitido
    if (user.role === UserRole.MANAGER && options.allowCompanyResource) {
      return true;
    }

    // Se chegou até aqui, verifica se é o próprio recurso do usuário
    if (options.allowOwnResource && user.sub === resourceId) {
      return true;
    }

    // Se chegou até aqui, acesso negado
    throw new ForbiddenException('Acesso negado: Usuário não tem permissão para acessar este recurso');
  }
}
