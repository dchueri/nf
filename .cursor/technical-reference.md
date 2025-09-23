# Central de Notas PJ - Technical Reference

## Quick Access Information

### Project Structure
```
/Users/dchueri/Projects/nf/
├── client/          # React + TypeScript frontend
├── server/          # NestJS + TypeScript backend
├── docker/          # Docker configuration files
└── .cursor/         # Project documentation and scratchpad
```

### Key Technologies
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** NestJS, TypeScript, MongoDB, Mongoose, JWT, Swagger
- **Infrastructure:** Docker, Docker Compose, MongoDB
- **Development:** Hot reload, TypeScript strict mode, ESLint, Prettier

### Important Commands
```bash
# Start development environment
docker-compose up -d

# Frontend development
cd client && yarn dev

# Backend development
cd server && yarn start:dev

# Build for production
cd client && yarn build
cd server && yarn build
```

### Key Files and Components

#### Frontend Components
- `client/src/components/ui/` - Reusable UI components
- `client/src/components/dashboard/` - Dashboard-specific components
- `client/src/services/` - API service layers
- `client/src/types/` - TypeScript type definitions

#### Backend Modules
- `server/src/modules/auth/` - Authentication and authorization
- `server/src/modules/users/` - User management
- `server/src/modules/invoices/` - Invoice management
- `server/src/modules/companies/` - Company management

### Database Schema
- **Users:** Authentication, roles, company association
- **Companies:** Organization data, settings
- **Invoices:** File storage, status tracking, approval workflow
- **Notifications:** System alerts and reminders

### API Endpoints
- `POST /auth/login` - User authentication
- `GET /users` - User management
- `POST /invoices/upload` - Invoice file upload
- `GET /invoices` - Invoice listing and filtering
- `PATCH /invoices/:id/status` - Invoice status updates
- `POST /invoices/compile` - Invoice compilation to ZIP

### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/central-notas
JWT_SECRET=your-jwt-secret
PORT=3001
```

### Development Workflow
1. **Planning:** Update scratchpad with task breakdown
2. **Implementation:** Follow TDD approach with tests first
3. **Testing:** Manual testing and automated tests
4. **Documentation:** Update progress in scratchpad
5. **Review:** Code review and quality assurance

### Quality Standards
- **TypeScript:** Strict mode enabled, proper type definitions
- **Code Style:** ESLint + Prettier configuration
- **Testing:** Jest for unit tests, manual testing for UI
- **Documentation:** Comprehensive comments and README files
- **Security:** Input validation, authentication, file upload security

### Common Issues and Solutions
- **Docker Volume Issues:** Use specific volumes for node_modules
- **Hot Reload Problems:** Restart containers if cache issues occur
- **TypeScript Errors:** Check type definitions and imports
- **File Upload Issues:** Verify Multer configuration and file validation
- **Authentication Problems:** Check JWT token and user permissions

### Performance Considerations
- **Bundle Size:** Code splitting and lazy loading for large components
- **File Uploads:** Progress indicators and chunked uploads for large files
- **Database Queries:** Proper indexing and pagination
- **Caching:** Browser caching for static assets
- **Real-time Updates:** Efficient WebSocket or polling strategies
