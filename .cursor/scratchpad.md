# Central de Notas PJ - MVP Development Plan

## Background and Motivation

**Business Concept:** Central de Notas PJ is a Micro-SaaS designed to solve the recurring pain point of managing invoices from PJ (Pessoa Jurídica) collaborators. The target market is small to medium businesses in Florianópolis that regularly contract PJ collaborators and struggle with invoice collection, organization, and payment processing.

**Core Problem:** Monthly manual invoice collection from PJ collaborators creates administrative overhead, payment delays, and fiscal compliance risks. Current solutions (ERPs, manual processes) are either too complex/expensive or too basic.

**Market Opportunity:** Direct approach to local startups, marketing agencies, and tech consultancies in Florianópolis with a simple, focused solution.

## Key Challenges and Analysis

### Technical Challenges
- **File Management:** Secure storage and organization of invoice files (PDF/XML)
- **Automation:** WhatsApp/email reminder system integration
- **User Management:** Simple authentication for both companies and PJ collaborators
- **Data Export:** Consolidated reporting for accounting/finance teams

### Business Challenges
- **User Adoption:** Getting both companies and PJ collaborators to use the platform
- **Data Security:** Handling sensitive financial documents
- **Integration:** Seamless workflow integration with existing business processes

### Competitive Analysis
- **Direct Competitors:** ERPs (Omie, ContaAzul, Nibo) - complex, expensive, overkill
- **Indirect Competitors:** Manual processes (Google Drive, Excel, WhatsApp)
- **USP:** Ultra-simple, focused solution for PJ invoice management only

## High-level Task Breakdown

### Phase 1: MVP Core (Weeks 1-6)
**Goal:** Basic functionality for invoice upload, viewing, and simple reminders

#### Task 1.1: Project Setup & Architecture
- **Success Criteria:** Development environment ready, basic project structure established
- **Complexity:** Low
- **Deliverables:** Project repository, development environment, basic folder structure

#### Task 1.2: User Authentication System
- **Success Criteria:** Companies and PJ collaborators can register/login securely
- **Complexity:** Medium
- **Deliverables:** User registration, login, role-based access control

#### Task 1.3: Invoice Upload & Storage
- **Success Criteria:** PJ collaborators can upload invoice files, companies can view them
- **Complexity:** Medium
- **Deliverables:** File upload system, secure storage, basic file validation

#### Task 1.4: Dashboard & Invoice Management
- **Success Criteria:** Companies can see who has/hasn't submitted invoices, basic filtering
- **Complexity:** Medium
- **Deliverables:** Company dashboard, invoice status tracking, basic search/filter

#### Task 1.5: Basic Reminder System
- **Success Criteria:** Automated email reminders for missing invoices
- **Complexity:** Medium
- **Deliverables:** Email reminder system, reminder scheduling logic

#### Task 1.6: Data Export
- **Success Criteria:** Companies can export monthly invoice summaries
- **Complexity:** Low
- **Deliverables:** CSV/Excel export, basic reporting

### Phase 2: Usability Improvements (Weeks 7-10)
**Goal:** Enhanced user experience and workflow optimization

#### Task 2.1: WhatsApp Integration
- **Success Criteria:** WhatsApp reminders for missing invoices
- **Complexity:** High
- **Deliverables:** WhatsApp Business API integration, message templates

#### Task 2.2: Advanced Dashboard Features
- **Success Criteria:** Better filtering, sorting, and status management
- **Complexity:** Low
- **Deliverables:** Enhanced dashboard, status updates, bulk actions

#### Task 2.3: Mobile Responsiveness
- **Success Criteria:** Platform works seamlessly on mobile devices
- **Complexity:** Medium
- **Deliverables:** Mobile-optimized UI, responsive design

### Phase 3: Advanced Features (Weeks 11-16)
**Goal:** Additional value-add features and integrations

#### Task 3.1: Payment Tracking
- **Success Criteria:** Track invoice payment status
- **Complexity:** Medium
- **Deliverables:** Payment status tracking, payment confirmation workflow

#### Task 3.2: Advanced Reporting
- **Success Criteria:** Comprehensive financial reporting and analytics
- **Complexity:** Medium
- **Deliverables:** Financial dashboards, trend analysis, compliance reports

#### Task 3.3: API & Integrations
- **Success Criteria:** Basic API for third-party integrations
- **Complexity:** High
- **Deliverables:** REST API, webhook system, integration documentation

## Core Features - Prioritized Backlog

### MVP Essential Features (Must Have)
1. **User Authentication & Management**
   - Company registration and login
   - PJ collaborator invitation and registration
   - Role-based access control

2. **Invoice Management**
   - File upload (PDF/XML support)
   - Invoice metadata capture (date, amount, description)
   - Status tracking (pending, submitted, approved)

3. **Dashboard & Visibility**
   - Company overview of all collaborators
   - Invoice submission status per collaborator
   - Monthly invoice summary

4. **Reminder System**
   - Automated email reminders
   - Configurable reminder schedules
   - Reminder history tracking

5. **Data Export**
   - Monthly invoice summary export (CSV/Excel)
   - Invoice file download (ZIP)
   - Basic reporting

### Secondary Features (Future Iterations)
1. **WhatsApp Integration**
2. **Payment Tracking**
3. **Advanced Analytics**
4. **API & Integrations**
5. **Mobile App**
6. **Multi-language Support**

## User Flow

### Company User Journey
1. **Registration & Setup**
   - Company registers and creates account
   - Invites PJ collaborators via email
   - Sets up reminder preferences

2. **Monthly Workflow**
   - Views dashboard showing invoice submission status
   - Receives automated reminders for missing invoices
   - Reviews submitted invoices
   - Exports monthly summary for accounting

3. **Ongoing Management**
   - Adds/removes collaborators
   - Adjusts reminder schedules
   - Views historical data and trends

### PJ Collaborator Journey
1. **Onboarding**
   - Receives invitation email
   - Creates account and profile
   - Views company requirements and deadlines

2. **Monthly Submission**
   - Receives reminder notifications
   - Uploads invoice files
   - Confirms submission status

3. **Account Management**
   - Updates profile information
   - Views submission history
   - Manages notification preferences

## UX/UI Guidelines

### Design Principles
- **Simplicity First:** Clean, uncluttered interface focused on core tasks
- **Mobile-First:** Responsive design that works on all devices
- **Progressive Disclosure:** Show essential information first, details on demand
- **Clear Visual Hierarchy:** Use color, typography, and spacing to guide users

### Layout & Navigation
- **Single-Page Application:** Minimize page reloads and navigation complexity
- **Sticky Header:** Always accessible navigation and user controls
- **Card-Based Design:** Organize information in digestible, scannable cards
- **Breadcrumb Navigation:** Clear indication of current location and path

### Accessibility & Usability
- **High Contrast:** Ensure text readability for all users
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader Support:** Proper ARIA labels and semantic HTML
- **Error Prevention:** Clear validation messages and helpful error states

### Color Scheme & Typography
- **Professional Palette:** Blues and grays for trust and professionalism
- **Status Colors:** Green (success), Yellow (warning), Red (error)
- **Typography:** Sans-serif fonts for readability, clear hierarchy

## Automation & Communication Logic

### Reminder System Rules
1. **Trigger Conditions:**
   - Invoice due date approaching (configurable: 3, 7, 14 days before)
   - Invoice not submitted by due date
   - Monthly deadline approaching

2. **Reminder Frequency:**
   - First reminder: 7 days before deadline
   - Second reminder: 3 days before deadline
   - Final reminder: Day of deadline
   - Escalation reminder: 1 day after deadline

3. **Communication Channels:**
   - **Phase 1:** Email only
   - **Phase 2:** Email + WhatsApp
   - **Future:** SMS, in-app notifications

### Notification Content
- **Subject Lines:** Clear, action-oriented (e.g., "Invoice Due: Action Required")
- **Message Structure:** Greeting, reminder context, action required, deadline, support contact
- **Personalization:** Company name, collaborator name, specific invoice details

### Automation Workflows
1. **Monthly Cycle:**
   - System generates monthly invoice requirements
   - Sends initial reminders to all collaborators
   - Tracks submission progress
   - Sends escalation reminders as needed

2. **Invoice Processing:**
   - Automatic file validation
   - Metadata extraction where possible
   - Status updates and notifications

## Privacy & Data Handling

### Data Security Requirements
- **Encryption:** All data encrypted in transit and at rest
- **Access Control:** Role-based permissions, principle of least privilege
- **Audit Logging:** Track all data access and modifications
- **Data Retention:** Configurable retention policies, automatic cleanup

### Compliance Considerations
- **LGPD Compliance:** Brazilian data protection law compliance
- **Financial Data:** Secure handling of financial documents
- **User Consent:** Clear consent for data processing and communications
- **Data Portability:** Users can export their data

### Security Best Practices
- **Input Validation:** Sanitize all user inputs
- **File Upload Security:** Virus scanning, file type validation
- **Session Management:** Secure session handling, automatic logout
- **Backup & Recovery:** Regular backups, disaster recovery plan

## Technical Stack Recommendations

### Backend Technology
- **Framework:** NestJS + TS
- **Database:** PostgreSQL (reliable, ACID compliance, JSON support)
- **Authentication:** JWT tokens with refresh mechanism
- **File Storage:** AWS S3 or similar cloud storage
- **Caching:** Redis for session management and caching

### Frontend Technology
- **Framework:** React with TypeScript (component-based, type safety)
- **State Management:** React Context API or Zustand (simple, lightweight)
- **UI Library:** Tailwind CSS + Headless UI (rapid development, customizable)
- **Build Tool:** Vite (fast development, modern tooling)

### Infrastructure & DevOps
- **Hosting:** Vercel (frontend) + Railway/Render (backend)
- **Database Hosting:** Supabase or Railway PostgreSQL
- **File Storage:** AWS S3 or Cloudinary
- **Monitoring:** Sentry for error tracking
- **CI/CD:** GitHub Actions for automated testing and deployment

### Third-Party Integrations
- **Email Service:** SendGrid or Resend (reliable delivery)
- **WhatsApp Business API:** Meta Business API (Phase 2)
- **Payment Processing:** Stripe (future billing features)
- **File Processing:** PDF.js for PDF handling, xml2js for XML

## Implementation Roadmap

### Phase 1: MVP Core (Weeks 1-6)
**Week 1-2:** Project setup, authentication system
**Week 3-4:** Invoice upload and storage
**Week 5-6:** Dashboard, basic reminders, data export

**Success Metrics:**
- Users can complete core workflow end-to-end
- Basic reminder system functional
- Data export working correctly

### Phase 2: Usability Improvements (Weeks 7-10)
**Week 7-8:** WhatsApp integration
**Week 9-10:** Enhanced dashboard, mobile optimization

**Success Metrics:**
- WhatsApp reminders working
- Mobile experience optimized
- User engagement improved

### Phase 3: Advanced Features (Weeks 11-16)
**Week 11-13:** Payment tracking, advanced reporting
**Week 14-16:** API development, integration testing

**Success Metrics:**
- Payment tracking functional
- API endpoints working
- Ready for beta testing

## Project Status Board

### Current Status / Progress Tracking
- [x] Project initialization and setup
- [x] Technical architecture planning
- [x] Development environment setup
- [ ] Authentication system development
- [ ] Invoice management system
- [ ] Dashboard development
- [ ] Reminder system implementation
- [ ] Data export functionality
- [ ] Testing and quality assurance
- [ ] Deployment and launch preparation

### Milestones
- **Week 2:** Authentication system complete
- **Week 4:** Invoice upload system functional
- **Week 6:** MVP core complete and testable
- **Week 10:** Usability improvements complete
- **Week 16:** Advanced features complete

## Executor's Feedback or Assistance Requests

### Task 1.1: Project Setup & Architecture - ✅ COMPLETO

**Status:** Concluído com sucesso
**Data:** $(date)

**O que foi implementado:**
1. ✅ Estrutura de pastas organizada para o projeto
2. ✅ Dependências do NestJS configuradas (MongoDB, JWT, Passport, etc.)
3. ✅ Schemas do MongoDB criados (User, Company, Invoice)
4. ✅ Configuração do banco de dados MongoDB
5. ✅ Configuração do Swagger para documentação da API
6. ✅ Arquivo de configuração de ambiente (.env.example)
7. ✅ README atualizado com instruções de setup
8. ✅ Estrutura base do projeto configurada
9. ✅ **Docker Compose configurado com MongoDB, servidor e cliente**
10. ✅ **Scripts de setup e inicialização criados**

**Tecnologias configuradas:**
- **Backend:** NestJS + TypeScript
- **Banco:** MongoDB + Mongoose
- **Autenticação:** JWT + Passport
- **Validação:** class-validator + class-transformer
- **Documentação:** Swagger/OpenAPI
- **Upload:** Multer para arquivos

**Próximo passo:** Implementar o sistema de autenticação (Task 1.2)

**Observações:** 
- Projeto compila sem erros
- Estrutura base está pronta para desenvolvimento
- MongoDB configurado como banco principal (conforme solicitado pelo usuário)
- **Docker Compose configurado para desenvolvimento completo**
- **Pasta uploads mantida no Git com .gitkeep**

## Lessons

*This section will capture learnings and solutions during development*

---

**Next Steps:** Awaiting user confirmation to proceed with implementation. The Planner has completed the comprehensive development plan. The Executor is ready to begin Phase 1 implementation when authorized.
