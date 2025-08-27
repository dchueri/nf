# Central de Notas PJ - Backend

Backend da aplicação Central de Notas PJ, desenvolvido com NestJS e MongoDB.

## 🚀 Setup do Projeto

### Pré-requisitos
- Node.js 18+
- Yarn ou npm
- MongoDB local ou MongoDB Atlas

### Instalação

1. **Instalar dependências:**
```bash
yarn install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar o arquivo .env com suas configurações
```

3. **Configurar MongoDB:**
- **Local:** Instalar MongoDB e iniciar o serviço
- **Atlas:** Usar a string de conexão do MongoDB Atlas

4. **Executar a aplicação:**
```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
```

## 📁 Estrutura do Projeto

```
src/
├── auth/           # Autenticação e autorização
├── users/          # Gerenciamento de usuários
├── companies/      # Gerenciamento de empresas
├── invoices/       # Gerenciamento de notas fiscais
├── common/         # Utilitários e interfaces compartilhadas
├── config/         # Configurações
└── app.module.ts   # Módulo principal
```

## 🔧 Tecnologias Utilizadas

- **Framework:** NestJS
- **Banco de Dados:** MongoDB com Mongoose
- **Autenticação:** JWT + Passport
- **Validação:** class-validator + class-transformer
- **Documentação:** Swagger/OpenAPI
- **Upload de Arquivos:** Multer

## 📚 API Documentation

Após iniciar a aplicação, a documentação Swagger estará disponível em:
```
http://localhost:3001/api
```

## 🧪 Testes

```bash
# Executar testes unitários
yarn test

# Executar testes em modo watch
yarn test:watch

# Executar testes com coverage
yarn test:cov

# Executar testes e2e
yarn test:e2e
```

## 📝 Scripts Disponíveis

- `yarn start:dev` - Inicia em modo desenvolvimento com hot reload
- `yarn build` - Compila o projeto
- `yarn start` - Inicia a aplicação compilada
- `yarn lint` - Executa o linter
- `yarn format` - Formata o código com Prettier

## 🔒 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `MONGODB_URI` | URI de conexão com MongoDB | `mongodb://localhost:27017/central-notas-pj` |
| `JWT_SECRET` | Chave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT | `7d` |
| `PORT` | Porta da aplicação | `3001` |
| `NODE_ENV` | Ambiente da aplicação | `development` |

## 🚀 Próximos Passos

1. Implementar sistema de autenticação
2. Criar CRUD de usuários e empresas
3. Implementar upload e gerenciamento de notas fiscais
4. Desenvolver sistema de lembretes automáticos
5. Configurar integração com WhatsApp Business API
