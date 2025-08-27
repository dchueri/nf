# Central de Notas PJ

Sistema completo para gerenciamento de notas fiscais de colaboradores PJ, desenvolvido com NestJS (backend) e React (frontend).

## 🚀 Quick Start com Docker

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Setup Rápido

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd central-notas-pj
```

2. **Execute o setup:**
```bash
./setup.sh
```

3. **Inicie os serviços:**
```bash
docker-compose up -d
```

4. **Acesse as aplicações:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001/api
- **MongoDB Compass:** mongodb://compass_user:compass_password@localhost:27017/central-notas-pj

## 🐳 Serviços Docker

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **client** | 3000 | Frontend React |
| **server** | 3001 | Backend NestJS |
| **mongodb** | 27017 | Banco de dados MongoDB |

## 📁 Estrutura do Projeto

```
├── client/                 # Frontend React + Vite + Tailwind
├── server/                 # Backend NestJS + MongoDB
├── docker/                 # Scripts de inicialização do MongoDB
├── docker-compose.yml      # Configuração dos serviços
├── setup.sh               # Script de setup automático
└── README.md              # Este arquivo
```

## 🔧 Comandos Docker Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f server

# Parar todos os serviços
docker-compose down

# Reconstruir e reiniciar
docker-compose up -d --build

# Ver status dos serviços
docker-compose ps

# Executar comando em um container
docker-compose exec server yarn test
```

## 🛠️ Desenvolvimento Local

### Backend (NestJS)
```bash
cd server
yarn install
yarn start:dev
```

### Frontend (React)
```bash
cd client
yarn install
yarn dev
```

### Banco de Dados
```bash
# MongoDB local
mongod

# Ou usar MongoDB Atlas (configurar no .env)
```

## 🔒 Variáveis de Ambiente

Copie o arquivo de exemplo e configure:
```bash
cp server/.env.example server/.env
```

**Variáveis principais:**
- `MONGODB_URI` - Conexão com MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `PORT` - Porta do servidor (padrão: 3001)

## 📚 Documentação da API

Após iniciar o backend, a documentação Swagger estará disponível em:
```
http://localhost:3001/api
```

## 🧪 Testes

```bash
# Backend
cd server
yarn test

# Frontend
cd client
yarn test
```

## 🚀 Deploy

### Produção
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para simplificar a gestão de notas fiscais PJ**
