# SETU - Technical Requirements Document

## Education Management System (EMS) v1.0

**Company:** NPATEL GROUP LTD  
**Document Version:** 1.0  
**Status:** Ready for Implementation  
**Date:** February 27, 2026  
**Target Infrastructure:** Dell R620 (32 cores, 128GB RAM, 3TB storage), 1Gbps network

## Table of Contents

1\. Executive Summary

2\. System Architecture Overview

3\. Frontend Architecture

4\. Backend Architecture

5\. Database Design

6\. API Structure

7\. Authentication & Authorization

8\. Third-Party Dependencies

9\. Security Architecture

10\. Performance & Scalability

11\. Deployment Architecture

12\. Monitoring & Observability

13\. Backup & Disaster Recovery

14\. Development Workflow

## 1\. Executive Summary

### 1.1 Technology Stack Selection

**Backend:**

*   **Language:** Node.js (v20 LTS) with TypeScript
*   **Framework:** NestJS (structured, scalable, enterprise-ready)
*   **Rationale:**
    *   Single language across stack (JavaScript/TypeScript)
    *   Excellent async I/O performance for real-time features
    *   Strong TypeScript support for type safety
    *   Built-in dependency injection and modular architecture
    *   Large ecosystem for education sector integrations

**Frontend:**

*   **Framework:** React (v18) with TypeScript
*   **UI Library:** Tailwind CSS + shadcn/ui components
*   **State Management:** Zustand (lightweight, simple)
*   **Rationale:**
    *   Industry standard with large talent pool
    *   Excellent performance with virtual DOM
    *   Rich ecosystem for education UIs
    *   Easy to build responsive, accessible interfaces

**Mobile:**

*   **Framework:** React Native with TypeScript
*   **Rationale:**
    *   Code sharing with web (business logic, types, utilities)
    *   Single development team can maintain both platforms
    *   Native performance for critical features (camera, notifications)

**Database:**

*   **Primary:** PostgreSQL 16 (ACID compliance, JSON support, mature)
*   **Cache:** Redis 7 (sessions, real-time data, job queues)
*   **File Storage:** MinIO (S3-compatible, self-hosted)
*   **Rationale:**
    *   PostgreSQL: Best relational database for complex queries, excellent JSON support
    *   Redis: Essential for real-time features, session management, job queues
    *   MinIO: Self-hosted object storage, no cloud vendor lock-in

**Infrastructure:**

*   **Containerization:** Docker + Docker Compose
*   **Reverse Proxy:** Nginx (SSL termination, load balancing, static assets)
*   **Process Manager:** PM2 (for Node.js processes)
*   **Rationale:** Simple, proven stack optimized for single-server deployment with future scaling path

### 1.2 Deployment Model

**Phase 1 (MVP - 6 months):**

*   Single Dell R620 server deployment
*   Docker containers for service isolation
*   PostgreSQL + Redis + MinIO on same server
*   Nginx as reverse proxy
*   Target: Support 5-10 pilot schools (up to 10,000 total users)

**Phase 2 (Post-Launch - 12+ months):**

*   Horizontal scaling with container orchestration (Docker Swarm or K3s)
*   Database replication (primary-replica setup)
*   Separate cache and file storage servers
*   Target: Support 50+ schools (up to 100,000 users)

## 2\. System Architecture Overview

### 2.1 High-Level Architecture Diagram

  
┌─────────────────────────────────────────────────────────────────┐  
│ USERS │  
│ \[Web Browser\] \[iOS App\] \[Android App\] \[API Clients\] │  
└────────────┬────────────────┬──────────────┬────────────────────┘  
│ │ │  
▼ ▼ ▼  
┌─────────────────────────────────────────────────────────────────┐  
│ NGINX REVERSE PROXY │  
│ • SSL Termination (Let's Encrypt) │  
│ • Load Balancing (future) │  
│ • Static Asset Serving │  
│ • Rate Limiting │  
└────────────┬──────────────────────────────────────────────────┬─┘  
│ │  
▼ ▼  
┌────────────────────────────────┐ ┌──────────────────────────┐  
│ WEB APPLICATION │ │ API GATEWAY │  
│ (React SPA) │ │ (NestJS) │  
│ • Server-Side Rendering (SSR) │ │ • Authentication │  
│ • Progressive Web App (PWA) │ │ • Rate Limiting │  
│ • Service Worker (offline) │ │ • Request Validation │  
└────────────────────────────────┘ │ • API Versioning │  
└───────────┬──────────────┘  
│  
┌───────────────────────────────┼───────────────────────────────┐  
│ │ │  
▼ ▼ ▼  
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  
│ AUTH SERVICE │ │ CORE SERVICES │ │ NOTIFICATION │  
│ • JWT issuing │ │ • User Mgmt │ │ SERVICE │  
│ • SSO (OAuth) │ │ • Student Mgmt │ │ • Email (SMTP) │  
│ • MFA │ │ • Attendance │ │ • SMS (Twilio) │  
│ • RBAC │ │ • Grading │ │ • Push (FCM) │  
└────────┬─────────┘ │ • Timetable │ │ • In-app │  
│ │ • Library │ └────────┬─────────┘  
│ │ • Incidents │ │  
│ └────────┬─────────┘ │  
│ │ │  
└─────────────────────────────┼─────────────────────────────┘  
│  
┌───────────────────────────┼───────────────────────────────┐  
│ │ │  
▼ ▼ ▼  
┌──────────────────┐ ┌────────────────────┐ ┌──────────────────┐  
│ POSTGRESQL │ │ REDIS │ │ MinIO │  
│ • User data │ │ • Sessions │ │ • Profile pics │  
│ • School config │ │ • Cache │ │ • Documents │  
│ • Transactions │ │ • Job queues │ │ • Attachments │  
│ • Reports │ │ • Real-time data │ │ • Backups │  
└──────────────────┘ └────────────────────┘ └──────────────────┘  

### 2.2 Service Architecture (Microservices-Lite)

We'll use a **modular monolith** for MVP with clear module boundaries for future extraction:

  
setu-backend/  
├── src/  
│ ├── modules/  
│ │ ├── auth/ # Authentication & authorization  
│ │ ├── users/ # User management  
│ │ ├── schools/ # School configuration  
│ │ ├── students/ # Student management  
│ │ ├── teachers/ # Teacher management  
│ │ ├── attendance/ # Attendance tracking  
│ │ ├── grading/ # Gradebook & assessments  
│ │ ├── timetable/ # Scheduling  
│ │ ├── library/ # Library management  
│ │ ├── incidents/ # Behavior management  
│ │ ├── communication/ # Messaging & announcements  
│ │ ├── notifications/ # Email, SMS, push notifications  
│ │ ├── reports/ # Report generation  
│ │ └── admin/ # IT admin dashboard  
│ ├── common/  
│ │ ├── decorators/ # Custom decorators  
│ │ ├── filters/ # Exception filters  
│ │ ├── guards/ # Auth guards  
│ │ ├── interceptors/ # Logging, transformation  
│ │ ├── pipes/ # Validation pipes  
│ │ └── utils/ # Shared utilities  
│ ├── config/ # Configuration management  
│ ├── database/ # Database setup, migrations  
│ └── main.ts # Application entry point  

**Module Communication:**

*   **Direct imports** within monolith (MVP)
*   **Message queues** (BullMQ with Redis) for async operations
*   **Event-driven** architecture for cross-module notifications

### 2.3 Data Flow Patterns

**Synchronous (REST API):**

  
Client → Nginx → API Gateway → Service Module → Database → Response  

**Asynchronous (Background Jobs):**

  
Client → API → Queue Job → Worker → Database/External API → Notification  
Example: Bulk import, report generation, email sending  

**Real-Time (WebSocket):**

  
Client ←→ Socket.IO Server ←→ Redis Pub/Sub ←→ Service Modules  
Example: Live attendance updates, notifications  

## 3\. Frontend Architecture

### 3.1 Web Application Structure

**Technology Stack:**

*   **React 18** (Concurrent rendering, Suspense)
*   **TypeScript 5.x** (Strict mode enabled)
*   **Vite** (Fast build tool, HMR)
*   **React Router v6** (Client-side routing)
*   **TanStack Query** (Server state management, caching)
*   **Zustand** (Client state management)
*   **Tailwind CSS** (Utility-first styling)
*   **shadcn/ui** (Accessible React components)
*   **React Hook Form** (Form validation with Zod schemas)
*   **Socket.IO Client** (Real-time updates)

**Project Structure:**

  
setu-frontend/  
├── src/  
│ ├── components/  
│ │ ├── ui/ # shadcn/ui components  
│ │ ├── forms/ # Reusable form components  
│ │ ├── layouts/ # Page layouts  
│ │ └── shared/ # Shared components  
│ ├── features/  
│ │ ├── auth/ # Login, MFA, password reset  
│ │ ├── dashboard/ # Role-based dashboards  
│ │ ├── students/ # Student management  
│ │ ├── attendance/ # Attendance marking  
│ │ ├── grading/ # Gradebook  
│ │ ├── timetable/ # Schedule management  
│ │ └── reports/ # Report generation  
│ ├── hooks/ # Custom React hooks  
│ ├── lib/  
│ │ ├── api/ # API client (axios)  
│ │ ├── auth/ # Auth utilities  
│ │ ├── validation/ # Zod schemas  
│ │ └── utils/ # Helper functions  
│ ├── stores/ # Zustand stores  
│ ├── types/ # TypeScript types  
│ └── App.tsx  
├── public/  
└── vite.config.ts  

### 3.2 Frontend Responsibilities

**Core Responsibilities:**

1\. **User Interface Rendering**

*   *   Responsive layouts (mobile-first design)
    *   Role-based views (Admin, Teacher, Student, Parent)
    *   Accessibility compliance (WCAG 2.1 AA)

2\. **Client-Side State Management**

*   *   **Server state:** TanStack Query (caching, refetching, pagination)
    *   **Client state:** Zustand (UI state, user preferences)
    *   **Form state:** React Hook Form (validation, submission)

3\. **Data Validation**

*   *   Client-side validation with Zod schemas (shared with backend)
    *   Real-time form feedback
    *   Type-safe form handling

4\. **API Communication**

*   *   REST API calls via axios
    *   Request/response interceptors (auth tokens, error handling)
    *   Automatic retry logic for failed requests
    *   WebSocket connections for real-time updates

5\. **Offline Support (PWA)**

*   *   Service Worker for offline caching
    *   IndexedDB for offline data storage
    *   Background sync for form submissions
    *   Offline indicator UI

6\. **Performance Optimization**

*   *   Code splitting (route-based)
    *   Lazy loading of components
    *   Image optimization (responsive images, lazy loading)
    *   Virtual scrolling for large lists

### 3.3 Mobile Application (React Native)

**Structure:**

  
setu-mobile/  
├── src/  
│ ├── screens/ # App screens (navigation)  
│ ├── components/ # Reusable components  
│ ├── navigation/ # React Navigation setup  
│ ├── services/ # API clients, auth  
│ ├── hooks/ # Custom hooks  
│ ├── store/ # State management  
│ ├── utils/ # Shared utilities  
│ └── types/ # TypeScript types (shared with web)  
├── android/  
├── ios/  
└── app.json  

**Key Features:**

*   **Offline-first architecture** (React Query with persistence)
*   **Push notifications** (Firebase Cloud Messaging)
*   **Biometric authentication** (Touch ID, Face ID)
*   **Camera integration** (profile photos, document scanning)
*   **Deep linking** (notifications → specific screens)

**Platform-Specific:**

*   **iOS:** Swift for native modules (camera, notifications)
*   **Android:** Kotlin for native modules

## 4\. Backend Architecture

### 4.1 Technology Stack

**Core Framework:**

*   **NestJS 10.x** (TypeScript Node.js framework)
*   **Node.js 20 LTS** (Long-term support, best performance)
*   **TypeScript 5.x** (Strict mode, ES2022 target)

**Why NestJS?**

*   Built-in **dependency injection** (testable, maintainable)
*   **Modular architecture** (easy to scale)
*   **TypeScript-first** (type safety, better DX)
*   **Decorators** for clean routing, validation, guards
*   **Built-in support** for WebSockets, microservices, GraphQL
*   **OpenAPI/Swagger** integration (automatic API docs)

**Key Libraries:**

*   **TypeORM** (ORM for PostgreSQL)
*   **Passport.js** (Authentication strategies)
*   **Class Validator** (DTO validation)
*   **BullMQ** (Job queues with Redis)
*   **Socket.IO** (WebSocket server)
*   **Winston** (Structured logging)
*   **Helmet** (Security headers)
*   **Rate Limiter** (Throttling)

### 4.2 Backend Responsibilities

**1\. Business Logic Layer**

*   Implement all domain business rules
*   Data validation and sanitization
*   Complex calculations (GPA, attendance percentages, etc.)
*   Workflow orchestration (enrollment, grading, etc.)

**2\. Data Access Layer**

*   Database CRUD operations via TypeORM
*   Transaction management (ACID compliance)
*   Query optimization (indexes, joins)
*   Data aggregations and analytics

**3\. Authentication & Authorization**

*   JWT token issuance and validation
*   SSO integration (OAuth 2.0, SAML)
*   Multi-factor authentication (TOTP)
*   Role-based access control (RBAC)
*   Row-level security (tenant isolation)

**4\. API Layer**

*   RESTful API endpoints (versioned: /api/v1/)
*   Request validation (DTOs with class-validator)
*   Response transformation (consistent format)
*   Error handling (standardized error codes)
*   Rate limiting (per-user, per-endpoint)
*   API documentation (Swagger/OpenAPI)

**5\. Integration Layer**

*   Email delivery (SMTP, SendGrid)
*   SMS delivery (Twilio)
*   Push notifications (Firebase Cloud Messaging)
*   SSO providers (Google Workspace, Azure AD)
*   Calendar integration (Google Calendar, Outlook)
*   Payment gateways (Stripe - future)

**6\. Background Jobs**

*   Scheduled tasks (cron jobs)
*   Async processing (bulk imports, report generation)
*   Email/SMS queue processing
*   Database backups
*   Data cleanup (old sessions, temp files)

**7\. File Management**

*   Upload handling (multipart/form-data)
*   File validation (type, size)
*   Storage in MinIO (S3-compatible)
*   Signed URLs for secure downloads
*   Image resizing (profile photos)

**8\. Real-Time Features**

*   WebSocket server (Socket.IO)
*   Live attendance updates
*   Real-time notifications
*   Presence detection (online/offline status)

### 4.3 Service Layer Architecture

**Module Example (Attendance):**

  
// attendance.module.ts  
@Module({  
imports: \[  
TypeOrmModule.forFeature(\[Attendance, Student, Teacher, Class\]),  
NotificationsModule, // For absence alerts  
\],  
controllers: \[AttendanceController\],  
providers: \[AttendanceService, AttendanceGateway\],  
exports: \[AttendanceService\],  
})  
export class AttendanceModule {}  
  
// attendance.service.ts  
@Injectable()  
export class AttendanceService {  
constructor(  
@InjectRepository(Attendance)  
private attendanceRepo: Repository<Attendance>,  
private notificationsService: NotificationsService,  
private eventEmitter: EventEmitter2,  
) {}  
  
async markAttendance(dto: MarkAttendanceDto, teacherId: string) {  
// 1. Validate teacher has access to class  
// 2. Create attendance record  
// 3. Emit event for real-time update  
// 4. Queue notification job if student is absent  
}  
  
async getStudentAttendance(studentId: string, filters: AttendanceFilters) {  
// Fetch attendance records with caching  
}  
  
async generateAttendanceReport(classId: string, dateRange: DateRange) {  
// Complex query with aggregations  
}  
}  
  
// attendance.controller.ts  
@Controller('api/v1/attendance')  
@UseGuards(JwtAuthGuard, RolesGuard)  
export class AttendanceController {  
constructor(private attendanceService: AttendanceService) {}  
  
@Post('mark')  
@Roles(Role.TEACHER, Role.ADMIN)  
async markAttendance(@Body() dto: MarkAttendanceDto, @User() user) {  
return this.attendanceService.markAttendance(dto, user.id);  
}  
  
@Get('student/:id')  
@Roles(Role.TEACHER, Role.ADMIN, Role.PARENT, Role.STUDENT)  
async getStudentAttendance(@Param('id') id: string, @Query() filters) {  
return this.attendanceService.getStudentAttendance(id, filters);  
}  
}  
  
// attendance.gateway.ts (WebSocket)  
@WebSocketGateway({ namespace: '/attendance' })  
export class AttendanceGateway {  
@SubscribeMessage('subscribe-class')  
handleSubscribe(client: Socket, classId: string) {  
client.join(\`class-${classId}\`);  
}  
  
// Called by service when attendance is marked  
notifyAttendanceUpdate(classId: string, data: AttendanceUpdate) {  
this.server.to(\`class-${classId}\`).emit('attendance-updated', data);  
}  
}  

### 4.4 Data Validation Strategy

**DTO (Data Transfer Object) Pattern:**

  
// create-student.dto.ts  
import { IsEmail, IsNotEmpty, IsOptional, IsDate, MaxLength } from 'class-validator';  
import { Transform } from 'class-transformer';  
  
export class CreateStudentDto {  
@IsNotEmpty()  
@MaxLength(100)  
firstName: string;  
  
@IsNotEmpty()  
@MaxLength(100)  
lastName: string;  
  
@IsEmail()  
email: string;  
  
@IsNotEmpty()  
@Transform(({ value }) => new Date(value))  
@IsDate()  
dateOfBirth: Date;  
  
@IsOptional()  
@MaxLength(20)  
rollNumber?: string;  
  
@IsNotEmpty()  
classId: string;  
}  

**Validation Pipe (Global):**

  
// main.ts  
app.useGlobalPipes(  
new ValidationPipe({  
whitelist: true, // Strip unknown properties  
forbidNonWhitelisted: true, // Throw error on unknown properties  
transform: true, // Auto-transform to DTO types  
transformOptions: {  
enableImplicitConversion: true,  
},  
}),  
);  

### 4.5 Error Handling Strategy

**Standardized Error Response:**

  
{  
statusCode: 400,  
message: 'Validation failed',  
error: 'Bad Request',  
timestamp: '2026-02-27T10:30:00Z',  
path: '/api/v1/students',  
errors: \[  
{  
field: 'email',  
message: 'email must be a valid email address',  
},  
\],  
}  

**Exception Filter:**

  
@Catch()  
export class AllExceptionsFilter implements ExceptionFilter {  
catch(exception: unknown, host: ArgumentsHost) {  
const ctx = host.switchToHttp();  
const response = ctx.getResponse();  
const request = ctx.getRequest();  
  
const status = exception instanceof HttpException  
? exception.getStatus()  
: HttpStatus.INTERNAL\_SERVER\_ERROR;  
  
const message = exception instanceof HttpException  
? exception.getResponse()  
: 'Internal server error';  
  
// Log to Winston  
logger.error({  
statusCode: status,  
message,  
path: request.url,  
method: request.method,  
userId: request.user?.id,  
stack: exception instanceof Error ? exception.stack : undefined,  
});  
  
response.status(status).json({  
statusCode: status,  
message,  
timestamp: new Date().toISOString(),  
path: request.url,  
});  
}  
}  

### 4.6 Logging Strategy

**Winston Configuration:**

  
// logger.config.ts  
export const loggerConfig = WinstonModule.forRoot({  
transports: \[  
new winston.transports.Console({  
format: winston.format.combine(  
winston.format.timestamp(),  
winston.format.colorize(),  
winston.format.printf(({ timestamp, level, message, context, ...meta }) => {  
return \`\[${timestamp}\] ${level} \[${context}\]: ${message} ${  
Object.keys(meta).length ? JSON.stringify(meta) : ''  
}\`;  
}),  
),  
}),  
new winston.transports.File({  
filename: 'logs/error.log',  
level: 'error',  
format: winston.format.json(),  
}),  
new winston.transports.File({  
filename: 'logs/combined.log',  
format: winston.format.json(),  
}),  
\],  
});  

**Logging Interceptor:**

  
@Injectable()  
export class LoggingInterceptor implements NestInterceptor {  
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {  
const request = context.switchToHttp().getRequest();  
const { method, url, body, user } = request;  
const now = Date.now();  
  
return next.handle().pipe(  
tap({  
next: (response) => {  
logger.info({  
method,  
url,  
statusCode: context.switchToHttp().getResponse().statusCode,  
duration: \`${Date.now() - now}ms\`,  
userId: user?.id,  
responseSize: JSON.stringify(response).length,  
});  
},  
error: (error) => {  
logger.error({  
method,  
url,  
error: error.message,  
duration: \`${Date.now() - now}ms\`,  
userId: user?.id,  
});  
},  
}),  
);  
}  
}  

## 5\. Database Design

### 5.1 Database Technology

**Primary Database: PostgreSQL 16**

**Rationale:**

*   **ACID compliance** (critical for educational records)
*   **JSON/JSONB support** (flexible metadata storage)
*   **Array types** (efficient for permissions, tags)
*   **Full-text search** (student/staff search)
*   **Window functions** (complex analytics)
*   **Row-level security** (tenant isolation)
*   **Excellent performance** (proven at scale)
*   **Rich ecosystem** (TypeORM, Prisma support)

**Configuration for Dell R620:**

  
\# postgresql.conf optimizations  
shared\_buffers = 32GB # 25% of 128GB RAM  
effective\_cache\_size = 96GB # 75% of RAM  
maintenance\_work\_mem = 2GB  
work\_mem = 128MB  
max\_connections = 200  
random\_page\_cost = 1.1 # SSD storage  
effective\_io\_concurrency = 200  
max\_worker\_processes = 16 # 32 cores available  
max\_parallel\_workers\_per\_gather = 4  
max\_parallel\_workers = 16  

### 5.2 Database Schema Design

**Schema Organization:**

  
setu\_production/  
├── public/ # Core tables  
├── audit/ # Audit logs (separate schema for performance)  
└── reports/ # Materialized views for reporting  

**Core Tables (High-Level Overview):**

  
\-- Multi-tenancy: Each school is a tenant  
CREATE TABLE organizations (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
name VARCHAR(255) NOT NULL,  
slug VARCHAR(100) UNIQUE NOT NULL,  
settings JSONB DEFAULT '{}',  
branding JSONB DEFAULT '{}',  
subscription\_tier VARCHAR(50),  
is\_active BOOLEAN DEFAULT true,  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_organizations\_slug ON organizations(slug);  
  
\-- Users: Staff, Teachers, Students, Parents  
CREATE TABLE users (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
email VARCHAR(255) NOT NULL,  
password\_hash VARCHAR(255), -- NULL for SSO users  
first\_name VARCHAR(100) NOT NULL,  
last\_name VARCHAR(100) NOT NULL,  
phone VARCHAR(20),  
profile\_picture\_url TEXT,  
role VARCHAR(50) NOT NULL, -- ADMIN, TEACHER, STUDENT, PARENT, STAFF  
is\_active BOOLEAN DEFAULT true,  
email\_verified BOOLEAN DEFAULT false,  
mfa\_enabled BOOLEAN DEFAULT false,  
mfa\_secret VARCHAR(32),  
last\_login\_at TIMESTAMP,  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(organization\_id, email)  
);  
CREATE INDEX idx\_users\_org\_email ON users(organization\_id, email);  
CREATE INDEX idx\_users\_org\_role ON users(organization\_id, role);  
  
\-- SSO Providers  
CREATE TABLE sso\_connections (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
provider VARCHAR(50) NOT NULL, -- GOOGLE, AZURE\_AD  
provider\_user\_id VARCHAR(255) NOT NULL,  
user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
access\_token\_encrypted TEXT,  
refresh\_token\_encrypted TEXT,  
token\_expires\_at TIMESTAMP,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(provider, provider\_user\_id)  
);  
  
\-- Academic Years  
CREATE TABLE academic\_years (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
name VARCHAR(100) NOT NULL,  
start\_date DATE NOT NULL,  
end\_date DATE NOT NULL,  
is\_current BOOLEAN DEFAULT false,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
  
\-- Terms/Semesters  
CREATE TABLE terms (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
academic\_year\_id UUID NOT NULL REFERENCES academic\_years(id) ON DELETE CASCADE,  
name VARCHAR(100) NOT NULL,  
start\_date DATE NOT NULL,  
end\_date DATE NOT NULL,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
  
\-- Grades (Year Groups)  
CREATE TABLE grades (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
name VARCHAR(50) NOT NULL, -- "Grade 1", "Year 7", etc.  
sequence INT NOT NULL,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(organization\_id, name)  
);  
  
\-- Classes (Sections)  
CREATE TABLE classes (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
grade\_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,  
academic\_year\_id UUID NOT NULL REFERENCES academic\_years(id) ON DELETE CASCADE,  
name VARCHAR(100) NOT NULL, -- "Grade 1-A"  
capacity INT,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_classes\_org\_year ON classes(organization\_id, academic\_year\_id);  
  
\-- Subjects  
CREATE TABLE subjects (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
name VARCHAR(100) NOT NULL,  
code VARCHAR(20),  
description TEXT,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
  
\-- Students (extends users)  
CREATE TABLE students (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
roll\_number VARCHAR(50),  
date\_of\_birth DATE NOT NULL,  
gender VARCHAR(20),  
blood\_group VARCHAR(10),  
address JSONB,  
medical\_info JSONB,  
enrollment\_date DATE,  
status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, WITHDRAWN, GRADUATED  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(organization\_id, roll\_number)  
);  
CREATE INDEX idx\_students\_org ON students(organization\_id);  
CREATE INDEX idx\_students\_user ON students(user\_id);  
  
\-- Class Enrollments  
CREATE TABLE class\_enrollments (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
class\_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,  
academic\_year\_id UUID NOT NULL REFERENCES academic\_years(id) ON DELETE CASCADE,  
enrolled\_at DATE DEFAULT CURRENT\_DATE,  
withdrawn\_at DATE,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(student\_id, academic\_year\_id)  
);  
CREATE INDEX idx\_enrollments\_class ON class\_enrollments(class\_id);  
  
\-- Guardians (Parents)  
CREATE TABLE guardians (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
relationship VARCHAR(50), -- FATHER, MOTHER, GUARDIAN  
occupation VARCHAR(100),  
created\_at TIMESTAMP DEFAULT NOW()  
);  
  
\-- Student-Guardian Relationships  
CREATE TABLE student\_guardians (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
guardian\_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,  
is\_primary BOOLEAN DEFAULT false,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(student\_id, guardian\_id)  
);  
  
\-- Teachers (extends users)  
CREATE TABLE teachers (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
employee\_id VARCHAR(50),  
qualification VARCHAR(255),  
specialization VARCHAR(255),  
hire\_date DATE,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(organization\_id, employee\_id)  
);  
  
\-- Teacher-Subject Assignments  
CREATE TABLE teacher\_subjects (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
teacher\_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,  
subject\_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(teacher\_id, subject\_id)  
);  
  
\-- Timetable Periods  
CREATE TABLE periods (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
name VARCHAR(50) NOT NULL,  
start\_time TIME NOT NULL,  
end\_time TIME NOT NULL,  
sequence INT NOT NULL,  
is\_break BOOLEAN DEFAULT false,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
  
\-- Class Timetable  
CREATE TABLE timetable\_slots (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
class\_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,  
subject\_id UUID REFERENCES subjects(id) ON DELETE SET NULL,  
teacher\_id UUID REFERENCES teachers(id) ON DELETE SET NULL,  
period\_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,  
day\_of\_week INT NOT NULL, -- 1 = Monday, 7 = Sunday  
room VARCHAR(100),  
created\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(class\_id, day\_of\_week, period\_id)  
);  
CREATE INDEX idx\_timetable\_teacher ON timetable\_slots(teacher\_id, day\_of\_week);  
  
\-- Attendance  
CREATE TABLE attendance\_records (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
class\_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,  
date DATE NOT NULL,  
period\_id UUID REFERENCES periods(id) ON DELETE SET NULL, -- NULL for full-day  
status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, LATE, EXCUSED  
marked\_by UUID NOT NULL REFERENCES users(id),  
remarks TEXT,  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW(),  
UNIQUE(student\_id, date, period\_id)  
);  
CREATE INDEX idx\_attendance\_student\_date ON attendance\_records(student\_id, date);  
CREATE INDEX idx\_attendance\_class\_date ON attendance\_records(class\_id, date);  
  
\-- Assignments  
CREATE TABLE assignments (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
class\_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,  
subject\_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,  
teacher\_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,  
title VARCHAR(255) NOT NULL,  
description TEXT,  
due\_date TIMESTAMP NOT NULL,  
max\_marks DECIMAL(5,2),  
attachment\_urls TEXT\[\],  
status VARCHAR(50) DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, CLOSED  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_assignments\_class ON assignments(class\_id);  
  
\-- Assignment Submissions  
CREATE TABLE assignment\_submissions (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
assignment\_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
submission\_text TEXT,  
attachment\_urls TEXT\[\],  
submitted\_at TIMESTAMP DEFAULT NOW(),  
is\_late BOOLEAN DEFAULT false,  
marks\_obtained DECIMAL(5,2),  
feedback TEXT,  
graded\_by UUID REFERENCES users(id),  
graded\_at TIMESTAMP,  
UNIQUE(assignment\_id, student\_id)  
);  
CREATE INDEX idx\_submissions\_assignment ON assignment\_submissions(assignment\_id);  
CREATE INDEX idx\_submissions\_student ON assignment\_submissions(student\_id);  
  
\-- Gradebook  
CREATE TABLE grade\_entries (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
subject\_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,  
academic\_year\_id UUID NOT NULL REFERENCES academic\_years(id) ON DELETE CASCADE,  
term\_id UUID REFERENCES terms(id) ON DELETE SET NULL,  
assessment\_type VARCHAR(50), -- ASSIGNMENT, TEST, EXAM, PROJECT  
assessment\_name VARCHAR(255),  
marks\_obtained DECIMAL(5,2),  
max\_marks DECIMAL(5,2),  
grade VARCHAR(10),  
remarks TEXT,  
entered\_by UUID NOT NULL REFERENCES users(id),  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_grades\_student ON grade\_entries(student\_id, academic\_year\_id);  
  
\-- Library Books  
CREATE TABLE books (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
isbn VARCHAR(20),  
title VARCHAR(255) NOT NULL,  
author VARCHAR(255),  
publisher VARCHAR(255),  
category VARCHAR(100),  
total\_copies INT DEFAULT 1,  
available\_copies INT DEFAULT 1,  
cover\_image\_url TEXT,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_books\_org ON books(organization\_id);  
CREATE INDEX idx\_books\_title ON books USING GIN(to\_tsvector('english', title));  
  
\-- Book Borrowing  
CREATE TABLE book\_borrowings (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
book\_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
borrowed\_at DATE DEFAULT CURRENT\_DATE,  
due\_date DATE NOT NULL,  
returned\_at DATE,  
fine\_amount DECIMAL(10,2) DEFAULT 0,  
status VARCHAR(50) DEFAULT 'BORROWED', -- BORROWED, RETURNED, OVERDUE  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_borrowings\_student ON book\_borrowings(student\_id);  
CREATE INDEX idx\_borrowings\_status ON book\_borrowings(status);  
  
\-- Incidents  
CREATE TABLE incidents (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
student\_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,  
reported\_by UUID NOT NULL REFERENCES users(id),  
incident\_type VARCHAR(50) NOT NULL, -- DISCIPLINE, SAFETY, ACADEMIC  
severity VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL  
description TEXT NOT NULL,  
action\_taken TEXT,  
assigned\_to UUID REFERENCES users(id),  
status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, IN\_PROGRESS, RESOLVED  
occurred\_at TIMESTAMP,  
resolved\_at TIMESTAMP,  
created\_at TIMESTAMP DEFAULT NOW(),  
updated\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_incidents\_student ON incidents(student\_id);  
CREATE INDEX idx\_incidents\_status ON incidents(status);  
  
\-- Announcements  
CREATE TABLE announcements (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
title VARCHAR(255) NOT NULL,  
content TEXT NOT NULL,  
author\_id UUID NOT NULL REFERENCES users(id),  
target\_audience VARCHAR(50), -- ALL, STUDENTS, PARENTS, TEACHERS  
target\_grade\_ids UUID\[\],  
target\_class\_ids UUID\[\],  
priority VARCHAR(20) DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT  
published\_at TIMESTAMP,  
expires\_at TIMESTAMP,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_announcements\_org ON announcements(organization\_id, published\_at);  
  
\-- Messages (Parent-Teacher Communication)  
CREATE TABLE messages (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
sender\_id UUID NOT NULL REFERENCES users(id),  
recipient\_id UUID NOT NULL REFERENCES users(id),  
subject VARCHAR(255),  
body TEXT NOT NULL,  
read\_at TIMESTAMP,  
parent\_message\_id UUID REFERENCES messages(id), -- For threading  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_messages\_recipient ON messages(recipient\_id, created\_at);  
  
\-- Notifications  
CREATE TABLE notifications (  
id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
user\_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  
type VARCHAR(50) NOT NULL, -- EMAIL, SMS, PUSH, IN\_APP  
channel VARCHAR(50) NOT NULL,  
title VARCHAR(255),  
body TEXT NOT NULL,  
data JSONB,  
status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SENT, FAILED  
sent\_at TIMESTAMP,  
read\_at TIMESTAMP,  
created\_at TIMESTAMP DEFAULT NOW()  
);  
CREATE INDEX idx\_notifications\_user ON notifications(user\_id, created\_at);  
CREATE INDEX idx\_notifications\_status ON notifications(status, created\_at);  
  
\-- Audit Log  
CREATE TABLE audit\_logs (  
id BIGSERIAL PRIMARY KEY,  
organization\_id UUID NOT NULL,  
user\_id UUID REFERENCES users(id) ON DELETE SET NULL,  
action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW  
entity\_type VARCHAR(100) NOT NULL, -- User, Student, Grade, etc.  
entity\_id UUID,  
changes JSONB, -- Before/after values  
ip\_address INET,  
user\_agent TEXT,  
created\_at TIMESTAMP DEFAULT NOW()  
) PARTITION BY RANGE (created\_at);  
  
\-- Partition by month for performance  
CREATE TABLE audit\_logs\_2026\_02 PARTITION OF audit\_logs  
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');  
  
CREATE INDEX idx\_audit\_org\_user ON audit\_logs(organization\_id, user\_id, created\_at);  
CREATE INDEX idx\_audit\_entity ON audit\_logs(entity\_type, entity\_id);  

### 5.3 Indexing Strategy

**Primary Indexes:**

*   Primary keys (UUID) automatically indexed
*   Foreign keys indexed for join performance
*   Unique constraints create indexes

**Performance Indexes:**

  
\-- Full-text search  
CREATE INDEX idx\_students\_name\_search ON students  
USING GIN(to\_tsvector('english', first\_name || ' ' || last\_name));  
  
CREATE INDEX idx\_users\_name\_search ON users  
USING GIN(to\_tsvector('english', first\_name || ' ' || last\_name));  
  
\-- Composite indexes for common queries  
CREATE INDEX idx\_attendance\_student\_date\_range ON attendance\_records(student\_id, date DESC);  
CREATE INDEX idx\_grade\_entries\_student\_year\_subject ON grade\_entries(student\_id, academic\_year\_id, subject\_id);  
  
\-- Partial indexes for active records  
CREATE INDEX idx\_users\_active ON users(organization\_id) WHERE is\_active = true;  
CREATE INDEX idx\_students\_active ON students(organization\_id) WHERE status = 'ACTIVE';  

### 5.4 Database Migrations

**TypeORM Migration Strategy:**

  
// typeorm.config.ts  
export default new DataSource({  
type: 'postgres',  
host: process.env.DB\_HOST,  
port: parseInt(process.env.DB\_PORT),  
username: process.env.DB\_USERNAME,  
password: process.env.DB\_PASSWORD,  
database: process.env.DB\_DATABASE,  
entities: \['src/\*\*/\*.entity.ts'\],  
migrations: \['src/database/migrations/\*.ts'\],  
synchronize: false, // NEVER true in production  
logging: process.env.NODE\_ENV === 'development',  
});  

**Migration Workflow:**

  
\# Generate migration from entity changes  
npm run migration:generate -- -n AddStudentAddress  
  
\# Run pending migrations  
npm run migration:run  
  
\# Revert last migration  
npm run migration:revert  

### 5.5 Data Retention & Archival

**Retention Policy:**

*   **Active data:** Last 2 academic years (hot storage - PostgreSQL)
*   **Archived data:** 3-5 years ago (warm storage - compressed tables)
*   **Historical data:** 5+ years (cold storage - MinIO with SQL backup)

**Archival Strategy:**

  
\-- Separate schema for archived data  
CREATE SCHEMA archive;  
  
\-- Move old academic years  
INSERT INTO archive.attendance\_records  
SELECT \* FROM attendance\_records  
WHERE date < '2024-01-01';  
  
DELETE FROM attendance\_records  
WHERE date < '2024-01-01';  
  
\-- Vacuum to reclaim space  
VACUUM FULL attendance\_records;  

## 6\. API Structure

### 6.1 API Design Principles

**RESTful Conventions:**

*   Use HTTP methods correctly (GET, POST, PUT, PATCH, DELETE)
*   Resource-oriented URLs (nouns, not verbs)
*   Consistent naming (kebab-case for URLs, camelCase for JSON)
*   Versioning in URL path (/api/v1/)
*   Stateless (JWT tokens, no server sessions)

**URL Structure:**

  
/api/v1/{resource}/{id}/{sub-resource}/{id}  

### 6.2 API Endpoints (High-Level Overview)

**Authentication & Authorization:**

  
POST /api/v1/auth/register # User registration  
POST /api/v1/auth/login # Email/password login  
POST /api/v1/auth/sso/google # Google OAuth login  
POST /api/v1/auth/sso/azure # Azure AD login  
POST /api/v1/auth/mfa/enable # Enable 2FA  
POST /api/v1/auth/mfa/verify # Verify 2FA code  
POST /api/v1/auth/refresh # Refresh JWT token  
POST /api/v1/auth/logout # Logout (invalidate refresh token)  
POST /api/v1/auth/forgot-password # Request password reset  
POST /api/v1/auth/reset-password # Reset password with token  
GET /api/v1/auth/me # Get current user profile  

**Users:**

  
GET /api/v1/users # List users (with filters)  
POST /api/v1/users # Create user  
GET /api/v1/users/:id # Get user by ID  
PATCH /api/v1/users/:id # Update user  
DELETE /api/v1/users/:id # Delete user  
POST /api/v1/users/bulk-import # Bulk import from CSV  
GET /api/v1/users/search?q={query} # Search users  

**Organizations (Schools):**

  
GET /api/v1/organizations # List organizations (admin only)  
POST /api/v1/organizations # Create organization  
GET /api/v1/organizations/:id # Get organization  
PATCH /api/v1/organizations/:id # Update organization  
GET /api/v1/organizations/:id/settings # Get settings  
PATCH /api/v1/organizations/:id/settings # Update settings  

**Students:**

  
GET /api/v1/students # List students  
POST /api/v1/students # Enroll student  
GET /api/v1/students/:id # Get student profile  
PATCH /api/v1/students/:id # Update student  
DELETE /api/v1/students/:id # Delete student  
GET /api/v1/students/:id/guardians # Get student guardians  
POST /api/v1/students/:id/guardians # Link guardian  
GET /api/v1/students/:id/attendance # Get attendance summary  
GET /api/v1/students/:id/grades # Get grades  
GET /api/v1/students/:id/report-card # Generate report card  
POST /api/v1/students/transfer # Transfer student to new class  
POST /api/v1/students/:id/withdraw # Withdraw student  

**Teachers:**

  
GET /api/v1/teachers # List teachers  
POST /api/v1/teachers # Add teacher  
GET /api/v1/teachers/:id # Get teacher profile  
PATCH /api/v1/teachers/:id # Update teacher  
DELETE /api/v1/teachers/:id # Delete teacher  
GET /api/v1/teachers/:id/classes # Get assigned classes  
GET /api/v1/teachers/:id/subjects # Get assigned subjects  
GET /api/v1/teachers/:id/timetable # Get teacher timetable  

**Classes:**

  
GET /api/v1/classes # List classes  
POST /api/v1/classes # Create class  
GET /api/v1/classes/:id # Get class details  
PATCH /api/v1/classes/:id # Update class  
DELETE /api/v1/classes/:id # Delete class  
GET /api/v1/classes/:id/students # Get enrolled students  
POST /api/v1/classes/:id/students # Enroll student  
DELETE /api/v1/classes/:id/students/:sid # Remove student  
GET /api/v1/classes/:id/timetable # Get class timetable  

**Attendance:**

  
POST /api/v1/attendance/mark # Mark attendance (single/bulk)  
GET /api/v1/attendance/class/:id # Get class attendance for date  
GET /api/v1/attendance/student/:id # Get student attendance history  
GET /api/v1/attendance/reports/daily # Daily attendance report  
GET /api/v1/attendance/reports/summary # Summary report (date range)  
PATCH /api/v1/attendance/:id # Update attendance record  

**Grading:**

  
GET /api/v1/assignments # List assignments  
POST /api/v1/assignments # Create assignment  
GET /api/v1/assignments/:id # Get assignment details  
PATCH /api/v1/assignments/:id # Update assignment  
DELETE /api/v1/assignments/:id # Delete assignment  
GET /api/v1/assignments/:id/submissions # Get all submissions  
POST /api/v1/assignments/:id/submit # Submit assignment (student)  
PATCH /api/v1/submissions/:id/grade # Grade submission (teacher)  
  
GET /api/v1/grades/student/:id # Get student gradebook  
POST /api/v1/grades # Enter grades  
PATCH /api/v1/grades/:id # Update grade  
GET /api/v1/grades/reports/class/:id # Class grade report  

**Timetable:**

  
GET /api/v1/timetable/class/:id # Get class timetable  
GET /api/v1/timetable/teacher/:id # Get teacher timetable  
GET /api/v1/timetable/student/:id # Get student timetable  
POST /api/v1/timetable/slots # Create timetable slots  
PATCH /api/v1/timetable/slots/:id # Update slot  
DELETE /api/v1/timetable/slots/:id # Delete slot  
POST /api/v1/timetable/validate # Validate timetable (conflicts)  

**Library:**

  
GET /api/v1/library/books # List books  
POST /api/v1/library/books # Add book  
GET /api/v1/library/books/:id # Get book details  
PATCH /api/v1/library/books/:id # Update book  
DELETE /api/v1/library/books/:id # Delete book  
POST /api/v1/library/borrow # Borrow book  
POST /api/v1/library/return # Return book  
GET /api/v1/library/borrowings # Get borrowing history  
GET /api/v1/library/overdue # Get overdue books  

**Communication:**

  
GET /api/v1/announcements # List announcements  
POST /api/v1/announcements # Create announcement  
GET /api/v1/announcements/:id # Get announcement  
PATCH /api/v1/announcements/:id # Update announcement  
DELETE /api/v1/announcements/:id # Delete announcement  
  
GET /api/v1/messages # List messages (inbox)  
POST /api/v1/messages # Send message  
GET /api/v1/messages/:id # Get message thread  
PATCH /api/v1/messages/:id/read # Mark as read  

**Reports:**

  
GET /api/v1/reports/attendance # Attendance reports  
GET /api/v1/reports/grades # Grade reports  
GET /api/v1/reports/student/:id # Student progress report  
POST /api/v1/reports/bulk/report-cards # Generate bulk report cards  
GET /api/v1/reports/analytics # Analytics dashboard data  

**Admin (IT Dashboard):**

  
GET /api/v1/admin/health # System health status  
GET /api/v1/admin/users # User management  
GET /api/v1/admin/audit-logs # Audit logs  
GET /api/v1/admin/backups # Backup status  
POST /api/v1/admin/backups # Trigger backup  
GET /api/v1/admin/settings # System settings  
PATCH /api/v1/admin/settings # Update settings  

### 6.3 Request/Response Format

**Request Headers:**

  
Authorization: Bearer {jwt\_token}  
Content-Type: application/json  
Accept: application/json  
X-Organization-ID: {org\_uuid} // For multi-tenant isolation  

**Standard Response Format:**

  
{  
"success": true,  
"data": {  
// Response payload  
},  
"message": "Operation successful",  
"timestamp": "2026-02-27T10:30:00Z"  
}  

**Paginated Response:**

  
{  
"success": true,  
"data": \[  
// Array of items  
\],  
"pagination": {  
"page": 1,  
"limit": 20,  
"total": 150,  
"totalPages": 8,  
"hasNext": true,  
"hasPrevious": false  
},  
"message": "Students fetched successfully"  
}  

**Error Response:**

  
{  
"success": false,  
"statusCode": 400,  
"message": "Validation failed",  
"errors": \[  
{  
"field": "email",  
"message": "Invalid email format"  
}  
\],  
"timestamp": "2026-02-27T10:30:00Z",  
"path": "/api/v1/students"  
}  

### 6.4 API Versioning Strategy

**URL Path Versioning:**

  
/api/v1/students # Version 1 (current)  
/api/v2/students # Version 2 (future)  

**Version Support Policy:**

*   **Current version (v1):** Fully supported, active development
*   **Previous version:** Supported for 6 months after deprecation
*   **Deprecated versions:** Security patches only

**Deprecation Process:**

1\. Announce deprecation 3 months in advance

2\. Add deprecation warning header: X-API-Deprecated: true

3\. Provide migration guide for clients

4\. Maintain backward compatibility during transition period

### 6.5 Rate Limiting

**Strategy:**

*   **Per user:** 100 requests per minute
*   **Per IP:** 300 requests per minute (unauthenticated)
*   **Bulk operations:** 10 requests per hour
*   **File uploads:** 20 requests per hour

**Implementation:**

  
// rate-limit.config.ts  
import { ThrottlerModule } from '@nestjs/throttler';  
  
ThrottlerModule.forRoot({  
ttl: 60, // Time window in seconds  
limit: 100, // Max requests per window  
storage: new ThrottlerStorageRedisService(redisClient),  
});  

**Response Headers:**

  
X-RateLimit-Limit: 100  
X-RateLimit-Remaining: 87  
X-RateLimit-Reset: 1672531200  

### 6.6 API Documentation

**OpenAPI/Swagger Integration:**

  
// main.ts  
const config = new DocumentBuilder()  
.setTitle('SETU API')  
.setDescription('Education Management System API')  
.setVersion('1.0')  
.addBearerAuth()  
.addTag('Authentication')  
.addTag('Students')  
.addTag('Attendance')  
.build();  
  
const document = SwaggerModule.createDocument(app, config);  
SwaggerModule.setup('api/docs', app, document);  

**Access:** https://setu.npatelgroup.com/api/docs

## 7\. Authentication & Authorization

### 7.1 Authentication Strategy

**JWT-Based Authentication:**

**Token Types:**

1\. **Access Token:**

*   *   Short-lived (15 minutes)
    *   Contains user ID, role, organization ID, permissions
    *   Signed with RS256 (public/private key pair)
    *   Stored in memory (frontend)

2\. **Refresh Token:**

*   *   Long-lived (7 days)
    *   Stored in Redis with user session
    *   Rotated on each use (refresh token rotation)
    *   HttpOnly cookie (secure, SameSite=Strict)

**Token Payload:**

  
{  
"sub": "user-uuid",  
"email": "john.doe@school.edu",  
"role": "TEACHER",  
"organizationId": "org-uuid",  
"permissions": \["attendance:write", "grades:write"\],  
"iat": 1672531200,  
"exp": 1672532100  
}  

**Authentication Flow:**

  
1\. User submits credentials (email + password)  
2\. Backend validates credentials  
3\. If MFA enabled: Send OTP, wait for verification  
4\. Generate access token (15min) + refresh token (7 days)  
5\. Return access token in response body  
6\. Set refresh token as HttpOnly cookie  
7\. Frontend stores access token in memory  
8\. Frontend includes access token in Authorization header  
9\. When access token expires: Use refresh token to get new access token  
10\. Refresh token rotation: Issue new refresh token with each refresh  

### 7.2 Password Security

**Hashing Algorithm:** bcrypt (cost factor: 12)

  
import \* as bcrypt from 'bcrypt';  
  
// Hash password  
const saltRounds = 12;  
const passwordHash = await bcrypt.hash(plainPassword, saltRounds);  
  
// Verify password  
const isMatch = await bcrypt.compare(plainPassword, passwordHash);  

**Password Requirements:**

*   Minimum 8 characters
*   At least 1 uppercase letter
*   At least 1 lowercase letter
*   At least 1 number
*   At least 1 special character
*   Not in common password list (check against zxcvbn)

**Password Reset:**

1\. User requests password reset

2\. Generate secure random token (32 bytes)

3\. Store token hash in Redis (expires in 1 hour)

4\. Send email with reset link

5\. User clicks link, submits new password

6\. Verify token, update password, invalidate token

### 7.3 Multi-Factor Authentication (MFA)

**TOTP (Time-Based One-Time Password):**

*   Algorithm: RFC 6238
*   Library: otplib or speakeasy
*   QR Code: Generate with qrcode library

**MFA Setup Flow:**

  
1\. User enables MFA in settings  
2\. Backend generates secret key  
3\. Encrypt and store secret in database  
4\. Return QR code for authenticator app  
5\. User scans QR code (Google Authenticator, Authy)  
6\. User enters 6-digit code to verify setup  
7\. Backend validates code, marks MFA as enabled  
8\. Generate recovery codes (10x 8-character codes)  
9\. Return recovery codes (user must save)  

**MFA Login Flow:**

  
1\. User submits email + password  
2\. Backend validates credentials  
3\. If MFA enabled: Return "mfa\_required" status  
4\. User enters 6-digit code from authenticator app  
5\. Backend validates TOTP code (with time drift tolerance)  
6\. Issue access token + refresh token  

**Recovery Codes:**

*   10 single-use codes generated on MFA setup
*   Bcrypt-hashed before storage
*   Allow login when authenticator unavailable
*   Prompt user to regenerate after use

### 7.4 Single Sign-On (SSO)

**Supported Providers:**

1\. **Google Workspace (OAuth 2.0)**

2\. **Azure AD (SAML 2.0 / OAuth 2.0)**

**Google OAuth Flow:**

  
1\. User clicks "Sign in with Google"  
2\. Redirect to Google OAuth consent screen  
3\. User approves permissions  
4\. Google redirects back with authorization code  
5\. Exchange code for access token + ID token  
6\. Verify ID token signature (Google public keys)  
7\. Extract user email, name, profile picture  
8\. Check if user exists in database  
\- If yes: Update last login, return tokens  
\- If no: Create user account (if auto-provisioning enabled)  
9\. Issue access token + refresh token  

**Implementation (Passport.js):**

  
// google.strategy.ts  
@Injectable()  
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {  
constructor(  
private authService: AuthService,  
private configService: ConfigService,  
) {  
super({  
clientID: configService.get('GOOGLE\_CLIENT\_ID'),  
clientSecret: configService.get('GOOGLE\_CLIENT\_SECRET'),  
callbackURL: configService.get('GOOGLE\_CALLBACK\_URL'),  
scope: \['email', 'profile'\],  
});  
}  
  
async validate(accessToken: string, refreshToken: string, profile: any) {  
const { id, emails, displayName, photos } = profile;  
  
return this.authService.validateSSOUser({  
provider: 'GOOGLE',  
providerUserId: id,  
email: emails\[0\].value,  
name: displayName,  
profilePicture: photos\[0\].value,  
accessToken,  
refreshToken,  
});  
}  
}  

**Azure AD (SAML 2.0):**

*   Use passport-saml library
*   Configure SAML metadata URL from Azure AD
*   Map SAML attributes to user profile
*   Similar flow to OAuth

### 7.5 Role-Based Access Control (RBAC)

**Roles:**

  
enum Role {  
SUPER\_ADMIN = 'SUPER\_ADMIN', // Platform admin (NPATEL GROUP)  
ADMIN = 'ADMIN', // School admin  
TEACHER = 'TEACHER',  
STUDENT = 'STUDENT',  
PARENT = 'PARENT',  
STAFF = 'STAFF',  
}  

**Permissions (Granular):**

  
enum Permission {  
// User management  
'users:read',  
'users:create',  
'users:update',  
'users:delete',  
  
// Student management  
'students:read',  
'students:create',  
'students:update',  
'students:delete',  
  
// Attendance  
'attendance:read',  
'attendance:write',  
  
// Grading  
'grades:read',  
'grades:write',  
  
// Reports  
'reports:view',  
'reports:generate',  
  
// Settings  
'settings:read',  
'settings:write',  
  
// Audit logs  
'audit:read',  
}  

**Role-Permission Mapping:**

  
const rolePermissions = {  
\[Role.SUPER\_ADMIN\]: \['\*'\], // All permissions  
  
\[Role.ADMIN\]: \[  
'users:\*',  
'students:\*',  
'teachers:\*',  
'attendance:\*',  
'grades:\*',  
'reports:\*',  
'settings:\*',  
'audit:read',  
\],  
  
\[Role.TEACHER\]: \[  
'students:read',  
'attendance:read',  
'attendance:write',  
'grades:read',  
'grades:write',  
'reports:view',  
\],  
  
\[Role.STUDENT\]: \[  
'attendance:read', // Own attendance only  
'grades:read', // Own grades only  
'assignments:read',  
'assignments:submit',  
\],  
  
\[Role.PARENT\]: \[  
'students:read', // Linked children only  
'attendance:read',  
'grades:read',  
'reports:view',  
\],  
};  

**Authorization Guards:**

  
// roles.guard.ts  
@Injectable()  
export class RolesGuard implements CanActivate {  
constructor(private reflector: Reflector) {}  
  
canActivate(context: ExecutionContext): boolean {  
const requiredRoles = this.reflector.getAllAndOverride<Role\[\]>('roles', \[  
context.getHandler(),  
context.getClass(),  
\]);  
  
if (!requiredRoles) {  
return true; // No role requirement  
}  
  
const request = context.switchToHttp().getRequest();  
const user = request.user;  
  
return requiredRoles.some((role) => user.role === role);  
}  
}  
  
// Usage in controller  
@Get('attendance')  
@UseGuards(JwtAuthGuard, RolesGuard)  
@Roles(Role.TEACHER, Role.ADMIN)  
async getAttendance() {  
// Only teachers and admins can access  
}  

**Row-Level Security (Multi-Tenancy):**

  
// tenant.interceptor.ts  
@Injectable()  
export class TenantInterceptor implements NestInterceptor {  
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {  
const request = context.switchToHttp().getRequest();  
const user = request.user;  
  
// Inject organization ID into all queries  
request.organizationId = user.organizationId;  
  
return next.handle();  
}  
}  
  
// Repository wrapper  
class TenantAwareRepository<T> extends Repository<T> {  
findAll(options?: FindManyOptions<T>) {  
return super.find({  
...options,  
where: {  
...options?.where,  
organizationId: this.organizationId, // Auto-injected  
},  
});  
}  
}  

### 7.6 Session Management

**Redis Session Store:**

  
// session.service.ts  
@Injectable()  
export class SessionService {  
constructor(@InjectRedis() private redis: Redis) {}  
  
async createSession(userId: string, refreshToken: string, metadata: any) {  
const sessionId = uuidv4();  
const sessionKey = \`session:${userId}:${sessionId}\`;  
  
await this.redis.setex(  
sessionKey,  
604800, // 7 days in seconds  
JSON.stringify({  
userId,  
refreshToken: await this.hashToken(refreshToken),  
createdAt: new Date().toISOString(),  
lastActivity: new Date().toISOString(),  
metadata: {  
userAgent: metadata.userAgent,  
ipAddress: metadata.ipAddress,  
},  
}),  
);  
  
return sessionId;  
}  
  
async validateSession(userId: string, sessionId: string, refreshToken: string) {  
const sessionKey = \`session:${userId}:${sessionId}\`;  
const session = await this.redis.get(sessionKey);  
  
if (!session) {  
return false;  
}  
  
const sessionData = JSON.parse(session);  
const isValid = await bcrypt.compare(refreshToken, sessionData.refreshToken);  
  
if (isValid) {  
// Update last activity  
sessionData.lastActivity = new Date().toISOString();  
await this.redis.setex(sessionKey, 604800, JSON.stringify(sessionData));  
}  
  
return isValid;  
}  
  
async revokeSession(userId: string, sessionId: string) {  
await this.redis.del(\`session:${userId}:${sessionId}\`);  
}  
  
async revokeAllSessions(userId: string) {  
const keys = await this.redis.keys(\`session:${userId}:\*\`);  
if (keys.length > 0) {  
await this.redis.del(...keys);  
}  
}  
}  

## 8\. Third-Party Dependencies

### 8.1 Email Service

**Provider:** SMTP (Self-hosted) or SendGrid (Cloud)

**Configuration:**

  
// email.config.ts  
export const emailConfig = {  
transport: process.env.EMAIL\_TRANSPORT, // 'smtp' or 'sendgrid'  
  
smtp: {  
host: process.env.SMTP\_HOST,  
port: parseInt(process.env.SMTP\_PORT),  
secure: process.env.SMTP\_SECURE === 'true',  
auth: {  
user: process.env.SMTP\_USER,  
pass: process.env.SMTP\_PASSWORD,  
},  
},  
  
sendgrid: {  
apiKey: process.env.SENDGRID\_API\_KEY,  
},  
  
from: {  
name: 'SETU Education',  
email: process.env.EMAIL\_FROM,  
},  
};  

**Templates:**

*   Handlebars templates for HTML emails
*   Precompile templates for performance
*   Inline CSS for email client compatibility

### 8.2 SMS Service

**Provider:** Twilio

**Configuration:**

  
// sms.config.ts  
export const smsConfig = {  
accountSid: process.env.TWILIO\_ACCOUNT\_SID,  
authToken: process.env.TWILIO\_AUTH\_TOKEN,  
phoneNumber: process.env.TWILIO\_PHONE\_NUMBER,  
};  

**Usage:**

  
@Injectable()  
export class SmsService {  
private client: Twilio;  
  
constructor() {  
this.client = twilio(  
smsConfig.accountSid,  
smsConfig.authToken,  
);  
}  
  
async sendSms(to: string, message: string) {  
try {  
const result = await this.client.messages.create({  
body: message,  
from: smsConfig.phoneNumber,  
to,  
});  
return result;  
} catch (error) {  
logger.error('SMS sending failed', { to, error });  
throw error;  
}  
}  
}  

**Cost Optimization:**

*   SMS only for critical notifications (absence, security alerts)
*   Batch SMS for announcements
*   Fallback to email if SMS fails

### 8.3 Push Notifications

**Provider:** Firebase Cloud Messaging (FCM)

**Configuration:**

  
// firebase.config.ts  
import \* as admin from 'firebase-admin';  
  
admin.initializeApp({  
credential: admin.credential.cert({  
projectId: process.env.FIREBASE\_PROJECT\_ID,  
clientEmail: process.env.FIREBASE\_CLIENT\_EMAIL,  
privateKey: process.env.FIREBASE\_PRIVATE\_KEY.replace(/\\\\n/g, '\\n'),  
}),  
});  

**Usage:**

  
@Injectable()  
export class PushNotificationService {  
async sendPushNotification(deviceTokens: string\[\], notification: any) {  
const message = {  
notification: {  
title: notification.title,  
body: notification.body,  
},  
data: notification.data,  
tokens: deviceTokens,  
};  
  
const response = await admin.messaging().sendMulticast(message);  
  
// Handle failed tokens (expired, invalid)  
if (response.failureCount > 0) {  
this.handleFailedTokens(response, deviceTokens);  
}  
  
return response;  
}  
}  

### 8.4 File Storage

**Provider:** MinIO (Self-hosted S3-compatible)

**Configuration:**

  
// minio.config.ts  
import \* as Minio from 'minio';  
  
export const minioClient = new Minio.Client({  
endPoint: process.env.MINIO\_ENDPOINT,  
port: parseInt(process.env.MINIO\_PORT),  
useSSL: process.env.MINIO\_USE\_SSL === 'true',  
accessKey: process.env.MINIO\_ACCESS\_KEY,  
secretKey: process.env.MINIO\_SECRET\_KEY,  
});  

**Buckets:**

*   profile-pictures (public read)
*   documents (private, signed URLs)
*   assignments (private)
*   library-covers (public read)
*   backups (private)

**Usage:**

  
@Injectable()  
export class FileStorageService {  
async uploadFile(  
bucket: string,  
fileName: string,  
file: Buffer,  
metadata: any,  
) {  
await minioClient.putObject(bucket, fileName, file, metadata);  
return { bucket, fileName };  
}  
  
async getSignedUrl(bucket: string, fileName: string, expirySeconds = 3600) {  
return minioClient.presignedGetObject(bucket, fileName, expirySeconds);  
}  
  
async deleteFile(bucket: string, fileName: string) {  
await minioClient.removeObject(bucket, fileName);  
}  
}  

### 8.5 Calendar Integration

**Providers:** Google Calendar, Outlook Calendar

**Strategy:**

*   Export timetables as iCal format
*   Provide webhook for calendar sync
*   Users add calendar feed URL to their calendar app

**iCal Generation:**

  
import \* as ical from 'ical-generator';  
  
@Injectable()  
export class CalendarService {  
generateTimetableIcal(timetable: TimetableSlot\[\]) {  
const calendar = ical({ name: 'School Timetable' });  
  
timetable.forEach((slot) => {  
calendar.createEvent({  
start: slot.startTime,  
end: slot.endTime,  
summary: \`${slot.subject.name} - ${slot.class.name}\`,  
description: \`Teacher: ${slot.teacher.name}\`,  
location: slot.room,  
repeating: {  
freq: 'WEEKLY',  
byDay: \[this.getDayName(slot.dayOfWeek)\],  
until: slot.class.academicYear.endDate,  
},  
});  
});  
  
return calendar.toString();  
}  
}  

### 8.6 Payment Gateway (Future - Phase 5)

**Provider:** Stripe

**Integration:**

  
import Stripe from 'stripe';  
  
const stripe = new Stripe(process.env.STRIPE\_SECRET\_KEY);  
  
@Injectable()  
export class PaymentService {  
async createPaymentIntent(amount: number, currency: string) {  
return stripe.paymentIntents.create({  
amount: amount \* 100, // Convert to cents  
currency,  
});  
}  
  
async handleWebhook(payload: any, signature: string) {  
const event = stripe.webhooks.constructEvent(  
payload,  
signature,  
process.env.STRIPE\_WEBHOOK\_SECRET,  
);  
  
switch (event.type) {  
case 'payment\_intent.succeeded':  
// Handle successful payment  
break;  
case 'payment\_intent.payment\_failed':  
// Handle failed payment  
break;  
}  
}  
}  

### 8.7 Background Jobs

**Provider:** BullMQ (Redis-based job queue)

**Configuration:**

  
// bull.config.ts  
import { BullModule } from '@nestjs/bull';  
  
BullModule.forRoot({  
redis: {  
host: process.env.REDIS\_HOST,  
port: parseInt(process.env.REDIS\_PORT),  
password: process.env.REDIS\_PASSWORD,  
},  
});  

**Job Queues:**

  
// Notification queue  
@Processor('notifications')  
export class NotificationProcessor {  
@Process('send-email')  
async handleEmailJob(job: Job<EmailJob>) {  
const { to, subject, template, data } = job.data;  
await this.emailService.sendTemplatedEmail(to, subject, template, data);  
}  
  
@Process('send-sms')  
async handleSmsJob(job: Job<SmsJob>) {  
const { to, message } = job.data;  
await this.smsService.sendSms(to, message);  
}  
}  
  
// Report generation queue  
@Processor('reports')  
export class ReportProcessor {  
@Process('generate-report-card')  
async handleReportCard(job: Job) {  
const { studentId } = job.data;  
const report = await this.reportService.generateReportCard(studentId);  
  
// Store in MinIO  
await this.storageService.uploadFile('reports', \`${studentId}.pdf\`, report);  
  
// Notify completion  
await this.notificationQueue.add('send-email', {  
to: student.parent.email,  
subject: 'Report Card Ready',  
template: 'report-card-ready',  
});  
}  
}  

## 9\. Security Architecture

### 9.1 Security Principles

**Defense in Depth:**

*   Multiple layers of security controls
*   Assume breach mindset
*   Principle of least privilege
*   Zero trust architecture

### 9.2 Application Security

**Input Validation:**

*   Server-side validation (all inputs)
*   DTO validation with class-validator
*   Sanitize HTML inputs (XSS prevention)
*   SQL injection prevention (parameterized queries via TypeORM)

**Output Encoding:**

*   Escape HTML entities in responses
*   Content Security Policy (CSP) headers
*   X-Content-Type-Options: nosniff

**HTTPS Only:**

*   TLS 1.3 with strong cipher suites
*   HSTS header (Strict-Transport-Security)
*   Redirect HTTP to HTTPS

**Security Headers (Helmet.js):**

  
app.use(helmet({  
contentSecurityPolicy: {  
directives: {  
defaultSrc: \["'self'"\],  
styleSrc: \["'self'", "'unsafe-inline'"\],  
scriptSrc: \["'self'"\],  
imgSrc: \["'self'", "data:", "https:"\],  
},  
},  
hsts: {  
maxAge: 31536000,  
includeSubDomains: true,  
preload: true,  
},  
}));  

**CORS Configuration:**

  
app.enableCors({  
origin: process.env.ALLOWED\_ORIGINS.split(','),  
credentials: true,  
methods: \['GET', 'POST', 'PUT', 'PATCH', 'DELETE'\],  
allowedHeaders: \['Content-Type', 'Authorization', 'X-Organization-ID'\],  
});  

**Rate Limiting:**

*   Global rate limit (per IP)
*   Authenticated rate limit (per user)
*   Endpoint-specific limits
*   Distributed rate limiting (Redis)

**File Upload Security:**

*   Validate file types (whitelist)
*   Validate file size (max 10MB for documents, 2MB for images)
*   Scan for malware (ClamAV integration - optional)
*   Generate random filenames (prevent path traversal)
*   Store outside web root

### 9.3 Database Security

**Connection Security:**

*   SSL/TLS for database connections
*   Strong passwords (20+ characters, random)
*   Restrict access to localhost or private network
*   No direct database access from internet

**Query Security:**

*   Use ORM (TypeORM) to prevent SQL injection
*   Parameterized queries only
*   Validate/sanitize all inputs before queries

**Data Encryption:**

*   Encrypt sensitive columns (SSN, payment details)
*   Use PostgreSQL pgcrypto extension
*   Encrypt backups before storage

**Access Control:**

*   Separate database users for application, admin, backup
*   Grant minimum required privileges
*   Revoke unnecessary permissions

### 9.4 Infrastructure Security

**Server Hardening:**

  
\# Firewall (UFW)  
ufw default deny incoming  
ufw default allow outgoing  
ufw allow 22/tcp # SSH  
ufw allow 80/tcp # HTTP  
ufw allow 443/tcp # HTTPS  
ufw enable  
  
\# SSH hardening  
\- Disable root login  
\- Use SSH keys (disable password auth)  
\- Change default SSH port  
\- Fail2ban for brute-force protection  
  
\# Automatic security updates  
unattended-upgrades  

**Container Security:**

*   Run containers as non-root user
*   Read-only file systems where possible
*   Resource limits (CPU, memory)
*   Regular image updates (scan for vulnerabilities)

**Network Security:**

*   Private network for internal services
*   Firewall rules (allow only necessary ports)
*   Reverse proxy (Nginx) as security layer
*   VPN for admin access (optional)

### 9.5 Secrets Management

**Environment Variables:**

  
\# .env (never commit to Git)  
DATABASE\_URL=postgresql://user:pass@localhost:5432/setu  
JWT\_SECRET=<random-256-bit-key>  
REDIS\_PASSWORD=<random-password>  
MINIO\_SECRET\_KEY=<random-key>  
SMTP\_PASSWORD=<smtp-password>  
TWILIO\_AUTH\_TOKEN=<twilio-token>  

**Secret Storage:**

*   Use Docker secrets or Kubernetes secrets (future)
*   Encrypt secrets at rest
*   Rotate secrets regularly
*   Never log secrets

**Secret Generation:**

  
\# Generate random secrets  
openssl rand -base64 32 # JWT secret  
openssl rand -base64 24 # API keys  

### 9.6 Logging & Monitoring

**Security Logging:**

*   Failed login attempts
*   Password changes
*   Role/permission changes
*   Unusual activity patterns
*   API abuse (rate limit violations)

**Log Storage:**

*   Centralized logging (Winston → Files)
*   Log rotation (daily, keep 30 days)
*   Secure log storage (encrypt sensitive logs)

**Monitoring:**

*   System health (CPU, memory, disk)
*   Application errors (error rate, response time)
*   Security events (failed logins, permission violations)
*   Alerting (email/SMS for critical events)

### 9.7 Compliance

**GDPR Requirements:**

*   Data encryption (at rest and in transit)
*   Right to access (export user data)
*   Right to be forgotten (delete user data)
*   Data breach notification (within 72 hours)
*   Privacy policy and terms of service
*   Consent management

**Data Protection:**

  
@Injectable()  
export class DataProtectionService {  
// Export user data (GDPR right to access)  
async exportUserData(userId: string) {  
const user = await this.usersRepo.findOne(userId);  
const students = await this.studentsRepo.find({ where: { guardianId: userId } });  
const grades = await this.gradesRepo.find({ where: { studentId: In(students.map(s => s.id)) } });  
  
return {  
user,  
students,  
grades,  
// ... other related data  
};  
}  
  
// Delete user data (GDPR right to be forgotten)  
async deleteUserData(userId: string) {  
// Soft delete or anonymize (preserve records for compliance)  
await this.usersRepo.update(userId, {  
email: \`deleted\_${userId}@example.com\`,  
firstName: 'Deleted',  
lastName: 'User',  
phone: null,  
profilePictureUrl: null,  
isActive: false,  
});  
  
// Delete related personal data  
// But preserve attendance/grade records (anonymized)  
}  
}  

## 10\. Performance & Scalability

### 10.1 Caching Strategy

**Cache Layers:**

**1\. Application Cache (Redis):**

  
@Injectable()  
export class CacheService {  
constructor(@InjectRedis() private redis: Redis) {}  
  
// Cache user profile (frequently accessed)  
async getUserProfile(userId: string) {  
const cacheKey = \`user:${userId}\`;  
const cached = await this.redis.get(cacheKey);  
  
if (cached) {  
return JSON.parse(cached);  
}  
  
const user = await this.usersRepo.findOne(userId);  
await this.redis.setex(cacheKey, 3600, JSON.stringify(user)); // 1 hour  
return user;  
}  
  
// Cache school settings (rarely changes)  
async getSchoolSettings(orgId: string) {  
const cacheKey = \`school:settings:${orgId}\`;  
// Cache for 24 hours  
}  
  
// Invalidate cache on update  
async invalidateUserCache(userId: string) {  
await this.redis.del(\`user:${userId}\`);  
}  
}  

**What to Cache:**

*   User profiles (1 hour TTL)
*   School settings (24 hours TTL)
*   Timetables (12 hours TTL)
*   Attendance summaries (30 minutes TTL)
*   Grade reports (15 minutes TTL)
*   API responses (5 minutes TTL for list endpoints)

**2\. Database Query Cache:**

  
// TypeORM query caching  
findAll({ cache: { id: 'students\_list', milliseconds: 60000 } });  

**3\. HTTP Cache (Nginx):**

  
location ~\* \\.(jpg|jpeg|png|gif|ico|css|js)$ {  
expires 1y;  
add\_header Cache-Control "public, immutable";  
}  

### 10.2 Database Optimization

**Query Optimization:**

*   Use indexes on frequently queried columns
*   Avoid N+1 queries (use eager loading)
*   Use pagination for large datasets
*   Use database views for complex reports

**Connection Pooling:**

  
TypeOrmModule.forRoot({  
type: 'postgres',  
host: process.env.DB\_HOST,  
port: parseInt(process.env.DB\_PORT),  
username: process.env.DB\_USERNAME,  
password: process.env.DB\_PASSWORD,  
database: process.env.DB\_DATABASE,  
extra: {  
max: 20, // Max connections in pool  
min: 5, // Min connections  
idleTimeoutMillis: 30000,  
connectionTimeoutMillis: 2000,  
},  
});  

**Read Replicas (Future):**

  
┌──────────────┐  
│ Primary DB │ ← Writes  
└──────┬───────┘  
│  
├─ Replication ─→ ┌──────────────┐  
│ │ Replica 1 │ ← Reads  
│ └──────────────┘  
│  
└─ Replication ─→ ┌──────────────┐  
│ Replica 2 │ ← Reads  
└──────────────┘  

### 10.3 API Performance

**Response Compression:**

  
app.use(compression());  

**Pagination:**

  
@Get('students')  
async listStudents(@Query() query: PaginationDto) {  
const { page = 1, limit = 20 } = query;  
const skip = (page - 1) \* limit;  
  
const \[students, total\] = await this.studentsRepo.findAndCount({  
skip,  
take: limit,  
});  
  
return {  
data: students,  
pagination: {  
page,  
limit,  
total,  
totalPages: Math.ceil(total / limit),  
hasNext: page \* limit < total,  
hasPrevious: page > 1,  
},  
};  
}  

**Field Selection:**

  
@Get('students')  
async listStudents(@Query('fields') fields: string) {  
const select = fields ? fields.split(',') : undefined;  
return this.studentsRepo.find({ select });  
}  

**Async Operations:**

*   Use background jobs for heavy operations
*   Return job ID immediately, poll for status
*   WebSocket notifications on completion

### 10.4 Frontend Performance

**Code Splitting:**

  
// React Router lazy loading  
const Students = lazy(() => import('./features/students'));  
const Attendance = lazy(() => import('./features/attendance'));  
  
<Suspense fallback={<Loading />}>  
<Routes>  
<Route path="/students" element={<Students />} />  
<Route path="/attendance" element={<Attendance />} />  
</Routes>  
</Suspense>  

**Image Optimization:**

*   Lazy loading (Intersection Observer)
*   Responsive images (srcset)
*   WebP format (fallback to JPEG)
*   Thumbnail generation on upload

**Bundle Size:**

*   Tree shaking (remove unused code)
*   Minification
*   Compression (Brotli/Gzip)

### 10.5 Scalability Roadmap

**Phase 1 (MVP - 6 months):**

*   Single server deployment
*   Vertical scaling (upgrade server resources)
*   Target: 10,000 users

**Phase 2 (12 months):**

*   Separate database server
*   Read replicas for reporting
*   Separate Redis and MinIO servers
*   Target: 50,000 users

**Phase 3 (24 months):**

*   Container orchestration (Docker Swarm or K3s)
*   Load balancing (multiple app servers)
*   Database sharding (by organization ID)
*   CDN for static assets
*   Target: 100,000+ users

**Auto-Scaling Triggers:**

*   CPU usage > 70% for 5 minutes
*   Memory usage > 80%
*   Request queue length > 100

## 11\. Deployment Architecture

### 11.1 Server Configuration (Dell R620)

**Hardware:**

*   **CPUs:** 2x Intel Xeon (32 cores total)
*   **RAM:** 128GB DDR3
*   **Storage:** 3TB (RAID 10 for reliability)
*   **Network:** 1Gbps symmetrical

**Operating System:**

*   **Ubuntu Server 24.04 LTS** (5 years support)
*   Minimal installation (no GUI)
*   Automatic security updates enabled

### 11.2 Docker Architecture

**Docker Compose Setup:**

  
\# docker-compose.yml  
version: '3.8'  
  
services:  
\# Nginx Reverse Proxy  
nginx:  
image: nginx:alpine  
container\_name: setu-nginx  
ports:  
\- "80:80"  
\- "443:443"  
volumes:  
\- ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  
\- ./nginx/ssl:/etc/nginx/ssl:ro  
\- ./frontend/dist:/usr/share/nginx/html:ro  
depends\_on:  
\- api  
restart: unless-stopped  
networks:  
\- setu-network  
  
\# Backend API  
api:  
build:  
context: ./backend  
dockerfile: Dockerfile  
container\_name: setu-api  
environment:  
NODE\_ENV: production  
DB\_HOST: postgres  
DB\_PORT: 5432  
REDIS\_HOST: redis  
MINIO\_ENDPOINT: minio  
depends\_on:  
\- postgres  
\- redis  
\- minio  
restart: unless-stopped  
networks:  
\- setu-network  
deploy:  
resources:  
limits:  
cpus: '8'  
memory: 16G  
reservations:  
cpus: '4'  
memory: 8G  
  
\# PostgreSQL Database  
postgres:  
image: postgres:16-alpine  
container\_name: setu-postgres  
environment:  
POSTGRES\_DB: setu\_production  
POSTGRES\_USER: setu\_user  
POSTGRES\_PASSWORD: ${DB\_PASSWORD}  
volumes:  
\- postgres-data:/var/lib/postgresql/data  
\- ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf:ro  
command: postgres -c config\_file=/etc/postgresql/postgresql.conf  
restart: unless-stopped  
networks:  
\- setu-network  
deploy:  
resources:  
limits:  
cpus: '12'  
memory: 48G  
reservations:  
cpus: '8'  
memory: 32G  
  
\# Redis Cache  
redis:  
image: redis:7-alpine  
container\_name: setu-redis  
command: redis-server --requirepass ${REDIS\_PASSWORD} --maxmemory 16gb --maxmemory-policy allkeys-lru  
volumes:  
\- redis-data:/data  
restart: unless-stopped  
networks:  
\- setu-network  
deploy:  
resources:  
limits:  
cpus: '4'  
memory: 16G  
  
\# MinIO Object Storage  
minio:  
image: minio/minio:latest  
container\_name: setu-minio  
command: server /data --console-address ":9001"  
environment:  
MINIO\_ROOT\_USER: ${MINIO\_ACCESS\_KEY}  
MINIO\_ROOT\_PASSWORD: ${MINIO\_SECRET\_KEY}  
volumes:  
\- minio-data:/data  
restart: unless-stopped  
networks:  
\- setu-network  
deploy:  
resources:  
limits:  
cpus: '4'  
memory: 8G  
  
volumes:  
postgres-data:  
driver: local  
redis-data:  
driver: local  
minio-data:  
driver: local  
  
networks:  
setu-network:  
driver: bridge  

### 11.3 Nginx Configuration

**Main Configuration:**

  
\# nginx.conf  
user nginx;  
worker\_processes auto;  
error\_log /var/log/nginx/error.log warn;  
pid /var/run/nginx.pid;  
  
events {  
worker\_connections 4096;  
use epoll;  
}  
  
http {  
include /etc/nginx/mime.types;  
default\_type application/octet-stream;  
  
\# Logging  
log\_format main '$remote\_addr - $remote\_user \[$time\_local\] "$request" '  
'$status $body\_bytes\_sent "$http\_referer" '  
'"$http\_user\_agent" "$http\_x\_forwarded\_for"';  
access\_log /var/log/nginx/access.log main;  
  
\# Performance  
sendfile on;  
tcp\_nopush on;  
tcp\_nodelay on;  
keepalive\_timeout 65;  
types\_hash\_max\_size 2048;  
  
\# Compression  
gzip on;  
gzip\_vary on;  
gzip\_proxied any;  
gzip\_comp\_level 6;  
gzip\_types text/plain text/css text/xml text/javascript  
application/json application/javascript application/xml+rss;  
  
\# Rate limiting  
limit\_req\_zone $binary\_remote\_addr zone=general:10m rate=100r/s;  
limit\_req\_zone $binary\_remote\_addr zone=api:10m rate=30r/s;  
  
\# SSL configuration  
ssl\_protocols TLSv1.2 TLSv1.3;  
ssl\_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';  
ssl\_prefer\_server\_ciphers on;  
ssl\_session\_cache shared:SSL:10m;  
ssl\_session\_timeout 10m;  
  
\# Security headers  
add\_header X-Frame-Options "SAMEORIGIN" always;  
add\_header X-Content-Type-Options "nosniff" always;  
add\_header X-XSS-Protection "1; mode=block" always;  
add\_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;  
  
\# Upstream backend  
upstream api\_backend {  
server api:3000;  
keepalive 32;  
}  
  
\# HTTP redirect to HTTPS  
server {  
listen 80;  
server\_name setu.npatelgroup.com;  
return 301 https://$server\_name$request\_uri;  
}  
  
\# HTTPS server  
server {  
listen 443 ssl http2;  
server\_name setu.npatelgroup.com;  
  
ssl\_certificate /etc/nginx/ssl/fullchain.pem;  
ssl\_certificate\_key /etc/nginx/ssl/privkey.pem;  
  
\# Root for static files  
root /usr/share/nginx/html;  
index index.html;  
  
\# API proxy  
location /api/ {  
limit\_req zone=api burst=50 nodelay;  
  
proxy\_pass http://api\_backend;  
proxy\_http\_version 1.1;  
proxy\_set\_header Upgrade $http\_upgrade;  
proxy\_set\_header Connection 'upgrade';  
proxy\_set\_header Host $host;  
proxy\_set\_header X-Real-IP $remote\_addr;  
proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;  
proxy\_set\_header X-Forwarded-Proto $scheme;  
proxy\_cache\_bypass $http\_upgrade;  
  
\# Timeouts  
proxy\_connect\_timeout 60s;  
proxy\_send\_timeout 60s;  
proxy\_read\_timeout 60s;  
}  
  
\# WebSocket for real-time features  
location /socket.io/ {  
proxy\_pass http://api\_backend;  
proxy\_http\_version 1.1;  
proxy\_set\_header Upgrade $http\_upgrade;  
proxy\_set\_header Connection "upgrade";  
proxy\_set\_header Host $host;  
proxy\_set\_header X-Real-IP $remote\_addr;  
}  
  
\# Static files (frontend)  
location / {  
try\_files $uri $uri/ /index.html;  
expires 1h;  
add\_header Cache-Control "public, immutable";  
}  
  
\# Static assets with long cache  
location ~\* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {  
expires 1y;  
add\_header Cache-Control "public, immutable";  
}  
  
\# Health check  
location /health {  
access\_log off;  
return 200 "OK";  
}  
}  
}  

### 11.4 SSL/TLS Configuration

**Let's Encrypt (Free SSL):**

  
\# Install Certbot  
apt install certbot python3-certbot-nginx  
  
\# Obtain certificate  
certbot --nginx -d setu.npatelgroup.com  
  
\# Auto-renewal (cron job)  
0 0 \* \* \* certbot renew --quiet  

### 11.5 Deployment Process

**Continuous Deployment Pipeline:**

  
\# .github/workflows/deploy.yml  
name: Deploy to Production  
  
on:  
push:  
branches: \[main\]  
  
jobs:  
deploy:  
runs-on: ubuntu-latest  
steps:  
\- uses: actions/checkout@v3  
  
\- name: Build Docker images  
run: |  
docker build -t setu-api:latest ./backend  
docker build -t setu-frontend:latest ./frontend  
  
\- name: Save images  
run: |  
docker save setu-api:latest | gzip > api.tar.gz  
docker save setu-frontend:latest | gzip > frontend.tar.gz  
  
\- name: Copy to server  
uses: appleboy/scp-action@master  
with:  
host: ${{ secrets.SERVER\_HOST }}  
username: ${{ secrets.SERVER\_USER }}  
key: ${{ secrets.SSH\_PRIVATE\_KEY }}  
source: "\*.tar.gz,docker-compose.yml"  
target: "/opt/setu/"  
  
\- name: Deploy  
uses: appleboy/ssh-action@master  
with:  
host: ${{ secrets.SERVER\_HOST }}  
username: ${{ secrets.SERVER\_USER }}  
key: ${{ secrets.SSH\_PRIVATE\_KEY }}  
script: |  
cd /opt/setu  
docker load -i api.tar.gz  
docker load -i frontend.tar.gz  
docker-compose down  
docker-compose up -d  
docker system prune -f  

**Manual Deployment:**

  
\# On server  
cd /opt/setu  
  
\# Pull latest code  
git pull origin main  
  
\# Build and restart  
docker-compose build  
docker-compose down  
docker-compose up -d  
  
\# Check status  
docker-compose ps  
docker-compose logs -f api  

### 11.6 Zero-Downtime Deployment (Future)

**Blue-Green Deployment:**

  
1\. Deploy new version (green) alongside current (blue)  
2\. Run smoke tests on green  
3\. Switch traffic from blue to green  
4\. Keep blue running for quick rollback  
5\. After 24 hours, remove blue  

## 12\. Monitoring & Observability

### 12.1 Application Monitoring

**Logging Stack:**

*   **Winston** (structured logging)
*   **Log files** (daily rotation, 30-day retention)
*   **Future:** ELK Stack (Elasticsearch, Logstash, Kibana)

**Metrics to Track:**

*   Request rate (requests per second)
*   Response time (p50, p95, p99)
*   Error rate (5xx errors)
*   Database query time
*   Cache hit/miss ratio
*   Background job queue length

**Health Checks:**

  
@Controller('health')  
export class HealthController {  
@Get()  
async check() {  
return {  
status: 'ok',  
timestamp: new Date().toISOString(),  
uptime: process.uptime(),  
database: await this.checkDatabase(),  
redis: await this.checkRedis(),  
minio: await this.checkMinio(),  
};  
}  
}  

### 12.2 Infrastructure Monitoring

**System Metrics:**

  
\# Install monitoring tools  
apt install htop iotop nethogs  
  
\# Prometheus Node Exporter (future)  
docker run -d \\  
\--name=node\_exporter \\  
\-p 9100:9100 \\  
prom/node-exporter  

**Disk Monitoring:**

  
\# Check disk usage  
df -h  
  
\# Monitor I/O  
iostat -x 1  
  
\# Alert on 80% disk usage  

**Database Monitoring:**

  
\-- Active connections  
SELECT count(\*) FROM pg\_stat\_activity;  
  
\-- Long-running queries  
SELECT pid, now() - query\_start AS duration, query  
FROM pg\_stat\_activity  
WHERE state = 'active'  
AND now() - query\_start > interval '5 minutes';  
  
\-- Cache hit ratio  
SELECT  
sum(heap\_blks\_read) as heap\_read,  
sum(heap\_blks\_hit) as heap\_hit,  
sum(heap\_blks\_hit) / (sum(heap\_blks\_hit) + sum(heap\_blks\_read)) as ratio  
FROM pg\_statio\_user\_tables;  

### 12.3 Alerting

**Critical Alerts (SMS + Email):**

*   Server down
*   Database connection failure
*   Disk usage > 90%
*   Memory usage > 90%
*   High error rate (> 5% of requests)

**Warning Alerts (Email only):**

*   Disk usage > 80%
*   Memory usage > 80%
*   Slow queries (> 5 seconds)
*   Failed background jobs

**Monitoring Script:**

  
#!/bin/bash  
\# /opt/setu/scripts/monitor.sh  
  
\# Check disk usage  
DISK\_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')  
if \[ $DISK\_USAGE -gt 90 \]; then  
echo "CRITICAL: Disk usage at ${DISK\_USAGE}%" | mail -s "Disk Alert" admin@npatelgroup.com  
fi  
  
\# Check memory usage  
MEM\_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 \* 100}')  
if \[ $MEM\_USAGE -gt 90 \]; then  
echo "CRITICAL: Memory usage at ${MEM\_USAGE}%" | mail -s "Memory Alert" admin@npatelgroup.com  
fi  
  
\# Check if API is responding  
if ! curl -f http://localhost/health > /dev/null 2>&1; then  
echo "CRITICAL: API not responding" | mail -s "API Alert" admin@npatelgroup.com  
fi  

**Cron Job:**

  
\# Run every 5 minutes  
\*/5 \* \* \* \* /opt/setu/scripts/monitor.sh  

## 13\. Backup & Disaster Recovery

### 13.1 Backup Strategy

**What to Backup:**

1\. PostgreSQL database

2\. Redis data (sessions)

3\. MinIO files (user uploads)

4\. Application code

5\. Configuration files

6\. SSL certificates

**Backup Schedule:**

*   **Full backup:** Daily at 2:00 AM (low traffic)
*   **Incremental backup:** Every 6 hours
*   **Retention:** 30 days (rolling)

### 13.2 Database Backup

**PostgreSQL Backup Script:**

  
#!/bin/bash  
\# /opt/setu/scripts/backup-db.sh  
  
BACKUP\_DIR="/backups/postgres"  
DATE=$(date +%Y%m%d\_%H%M%S)  
FILENAME="setu\_${DATE}.sql.gz"  
  
\# Create backup directory  
mkdir -p $BACKUP\_DIR  
  
\# Dump database  
docker exec setu-postgres pg\_dump -U setu\_user setu\_production | gzip > $BACKUP\_DIR/$FILENAME  
  
\# Upload to MinIO  
mc cp $BACKUP\_DIR/$FILENAME minio/backups/postgres/  
  
\# Delete backups older than 30 days  
find $BACKUP\_DIR -name "\*.sql.gz" -mtime +30 -delete  
  
echo "Backup completed: $FILENAME"  

**Cron Job:**

  
\# Daily at 2:00 AM  
0 2 \* \* \* /opt/setu/scripts/backup-db.sh  

### 13.3 File Backup

**MinIO Backup:**

  
#!/bin/bash  
\# /opt/setu/scripts/backup-minio.sh  
  
BACKUP\_DIR="/backups/minio"  
DATE=$(date +%Y%m%d)  
  
\# Create backup directory  
mkdir -p $BACKUP\_DIR  
  
\# Sync MinIO buckets  
mc mirror --preserve minio/profile-pictures $BACKUP\_DIR/profile-pictures  
mc mirror --preserve minio/documents $BACKUP\_DIR/documents  
  
\# Create tarball  
tar -czf $BACKUP\_DIR/minio\_${DATE}.tar.gz -C $BACKUP\_DIR profile-pictures documents  
  
\# Cleanup  
rm -rf $BACKUP\_DIR/profile-pictures $BACKUP\_DIR/documents  
  
\# Delete backups older than 30 days  
find $BACKUP\_DIR -name "\*.tar.gz" -mtime +30 -delete  

### 13.4 Disaster Recovery

**Recovery Time Objective (RTO):** 4 hours  
**Recovery Point Objective (RPO):** 6 hours (max data loss)

**Recovery Procedure:**

**1\. Database Recovery:**

  
\# Stop application  
docker-compose down  
  
\# Restore database  
gunzip < /backups/postgres/setu\_20260227\_020000.sql.gz | \\  
docker exec -i setu-postgres psql -U setu\_user setu\_production  
  
\# Start application  
docker-compose up -d  

**2\. File Recovery:**

  
\# Extract backup  
tar -xzf /backups/minio/minio\_20260227.tar.gz -C /tmp/  
  
\# Restore to MinIO  
mc mirror --preserve /tmp/profile-pictures minio/profile-pictures  
mc mirror --preserve /tmp/documents minio/documents  

**3\. Full System Recovery:**

  
\# On new server  
  
\# 1. Install Docker  
curl -fsSL https://get.docker.com -o get-docker.sh  
sh get-docker.sh  
  
\# 2. Restore application code  
git clone https://github.com/npatelgroup/setu.git /opt/setu  
cd /opt/setu  
  
\# 3. Restore .env file  
cp /backups/config/.env .env  
  
\# 4. Restore SSL certificates  
cp /backups/ssl/\* nginx/ssl/  
  
\# 5. Start services  
docker-compose up -d  
  
\# 6. Restore database (see above)  
\# 7. Restore files (see above)  
  
\# 8. Verify  
curl https://setu.npatelgroup.com/health  

### 13.5 Backup Testing

**Monthly Test:**

*   Restore backup to test environment
*   Verify data integrity
*   Test application functionality
*   Document any issues

## 14\. Development Workflow

### 14.1 Git Workflow

**Branching Strategy:**

  
main # Production branch (protected)  
├── develop # Development branch  
│ ├── feature/user-management  
│ ├── feature/attendance-module  
│ └── bugfix/login-issue  

**Branch Naming:**

*   feature/ - New features
*   bugfix/ - Bug fixes
*   hotfix/ - Production hotfixes
*   release/ - Release preparation

**Commit Messages:**

  
feat: Add student enrollment form  
fix: Resolve attendance marking bug  
refactor: Improve database query performance  
docs: Update API documentation  
test: Add unit tests for grading service  

### 14.2 Code Review Process

**Pull Request Template:**

  
\## Description  
Brief description of changes  
  
\## Type of Change  
\- \[ \] Bug fix  
\- \[ \] New feature  
\- \[ \] Breaking change  
\- \[ \] Documentation update  
  
\## Testing  
\- \[ \] Unit tests pass  
\- \[ \] Integration tests pass  
\- \[ \] Manual testing completed  
  
\## Checklist  
\- \[ \] Code follows style guidelines  
\- \[ \] Self-review completed  
\- \[ \] Comments added for complex logic  
\- \[ \] Documentation updated  
\- \[ \] No console.log statements  

**Review Requirements:**

*   1 approval required for feature branches
*   2 approvals required for main branch
*   All CI checks must pass
*   No merge conflicts

### 14.3 Testing Strategy

**Unit Tests:**

  
// student.service.spec.ts  
describe('StudentService', () => {  
let service: StudentService;  
let repo: Repository<Student>;  
  
beforeEach(async () => {  
const module = await Test.createTestingModule({  
providers: \[  
StudentService,  
{  
provide: getRepositoryToken(Student),  
useClass: Repository,  
},  
\],  
}).compile();  
  
service = module.get<StudentService>(StudentService);  
repo = module.get<Repository<Student>>(getRepositoryToken(Student));  
});  
  
it('should create a student', async () => {  
const dto = { firstName: 'John', lastName: 'Doe', ... };  
const student = await service.create(dto);  
expect(student).toBeDefined();  
expect(student.firstName).toBe('John');  
});  
});  

**Integration Tests:**

  
// attendance.e2e-spec.ts  
describe('Attendance (e2e)', () => {  
let app: INestApplication;  
  
beforeAll(async () => {  
const moduleFixture = await Test.createTestingModule({  
imports: \[AppModule\],  
}).compile();  
  
app = moduleFixture.createNestApplication();  
await app.init();  
});  
  
it('/api/v1/attendance/mark (POST)', () => {  
return request(app.getHttpServer())  
.post('/api/v1/attendance/mark')  
.send({ studentId: '...', status: 'PRESENT' })  
.expect(201);  
});  
});  

**Test Coverage Target:**

*   Unit tests: 80% coverage
*   Integration tests: Key user flows
*   E2E tests: Critical paths

### 14.4 Environment Setup

**Local Development:**

  
\# Backend  
cd backend  
npm install  
cp .env.example .env  
npm run migration:run  
npm run start:dev  
  
\# Frontend  
cd frontend  
npm install  
cp .env.example .env  
npm run dev  

**Docker Development:**

  
docker-compose -f docker-compose.dev.yml up  

## 15\. Summary & Next Steps

### 15.1 Architecture Highlights

**Strengths:**

*   **Scalable:** Modular monolith with clear service boundaries for future extraction
*   **Secure:** Multi-layered security with authentication, authorization, encryption
*   **Performant:** Caching, database optimization, background jobs
*   **Maintainable:** TypeScript, clear folder structure, comprehensive testing
*   **Cost-effective:** Self-hosted on existing hardware with optimized resource usage

**Trade-offs:**

*   Single server initially (acceptable for MVP, scaling path defined)
*   Modular monolith vs microservices (right choice for team size and complexity)
*   Self-hosted vs cloud (cost savings, but requires more DevOps effort)

### 15.2 Technology Decisions Rationale

| Decision | Rationale |
| --- | --- |
| Node.js + NestJS | Single language across stack, async performance, enterprise-ready framework |
| PostgreSQL | ACID compliance, JSON support, excellent for educational data |
| Redis | Essential for sessions, caching, job queues, real-time features |
| MinIO | Self-hosted S3-compatible storage, no cloud vendor lock-in |
| Docker | Service isolation, easy deployment, future scaling path |
| JWT | Stateless authentication, mobile-friendly, scalable |
| TypeScript | Type safety, better DX, fewer runtime errors |

### 15.3 Immediate Next Steps

**Week 1-2: Infrastructure Setup**

1\. Set up Dell R620 server (Ubuntu 24.04 LTS)

2\. Install Docker + Docker Compose

3\. Configure firewall (UFW)

4\. Set up SSL certificates (Let's Encrypt)

5\. Configure domain DNS

**Week 3-4: Backend Foundation**

1\. Initialize NestJS project

2\. Set up PostgreSQL + TypeORM

3\. Set up Redis connection

4\. Set up MinIO

5\. Implement authentication module (JWT, SSO)

6\. Set up logging (Winston)

**Week 5-6: Frontend Foundation**

1\. Initialize React project (Vite)

2\. Set up routing (React Router)

3\. Set up API client (axios + TanStack Query)

4\. Implement authentication UI

5\. Set up UI library (Tailwind + shadcn/ui)

**Week 7-8: First User Stories**

1\. User registration/login

2\. School setup flow

3\. Class creation

4\. Student enrollment

5\. Basic dashboard

### 15.4 Risk Mitigation

**Technical Risks:**

*   **Single point of failure:** Implement comprehensive backup strategy, monitoring
*   **Performance issues:** Load testing before launch, caching strategy, database optimization
*   **Security vulnerabilities:** Regular security audits, dependency updates, penetration testing

**Operational Risks:**

*   **Data loss:** Automated backups, tested disaster recovery process
*   **Downtime:** Monitoring, alerting, quick rollback capability
*   **Scaling challenges:** Clear scaling roadmap, performance monitoring

### 15.5 Success Criteria

**Phase 1 (MVP - 6 months):**

*   ✅ All MVP features implemented and tested
*   ✅ 10 pilot schools onboarded successfully
*   ✅ 99% uptime during pilot
*   ✅ <2 second average response time
*   ✅ Positive feedback from pilot users (NPS > 50)

**Phase 2 (12 months):**

*   ✅ 50+ schools using the platform
*   ✅ 50,000+ active users
*   ✅ 99.5% uptime
*   ✅ IT Admin Dashboard fully operational
*   ✅ HR Management module launched

### 15.6 Open Questions for Decision

1\. **Hosting Strategy:**

*   *   Start with Dell R620 (confirmed)
    *   When to migrate to cloud? (At 50+ schools or 100,000 users)

2\. **Pricing Model:**

*   *   Per-student pricing or per-school flat rate?
    *   Free tier for small schools (<100 students)?

3\. **Support Model:**

*   *   In-house support team or outsourced?
    *   Support hours (business hours vs 24/7)?

4\. **Compliance Priorities:**

*   *   Which certifications to pursue? (ISO 27001, SOC 2, GDPR)
    *   Timeline for compliance audit?

## Document Information

**Author:** NPATEL GROUP LTD Technical Team  
**Last Updated:** February 27, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation

**Review Schedule:**

*   Monthly review during development (Sprints 1-12)
*   Quarterly review post-launch

**Change Log:**

| Date | Version | Changes |
| --- | --- | --- |
| 2026-02-27 | 1.0 | Initial technical requirements document |

**End of Technical Requirements Document**