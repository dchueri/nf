import { SetMetadata } from '@nestjs/common';
import { ResourceAccessOptions } from '../guards/resource-access.guard';

/**
 * Decorator para configurar controle de acesso a recursos específicos
 * 
 * @example
 * // Usuário pode acessar seu próprio recurso
 * @ResourceAccess({ allowOwnResource: true })
 * 
 * // Empresa pode acessar recursos da empresa
 * @ResourceAccess({ allowCompanyResource: true })
 * 
 * // Ambos os casos
 * @ResourceAccess({ allowOwnResource: true, allowCompanyResource: true })
 * 
 * // Usar parâmetro diferente de 'id'
 * @ResourceAccess({ allowOwnResource: true, resourceParamName: 'userId' })
 */
export const ResourceAccess = (options: ResourceAccessOptions) => SetMetadata('resourceAccess', options);
