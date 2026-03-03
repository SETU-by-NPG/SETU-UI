**Product Requirements Document v1.0**

**1. Problem Statement**

Educational institutions currently rely on fragmented systems for managing students, staff, attendance, grading, communication, and scheduling. This results in:

- **Operational inefficiency**: Manual data entry, duplicate records, and disconnected workflows

- **Poor visibility**: Limited real-time insights into student performance, attendance trends, or resource utilization

- **Communication gaps**: Delayed or inconsistent communication between teachers, parents, and administration

- **High costs**: Multiple vendor subscriptions for overlapping functionality

- **Security risks**: Inconsistent access controls and audit trails across disparate systems

SETU aims to consolidate these core education workflows into a unified, role-based platform that is secure, scalable, and cost-effective.

**2. Target Users**

**Primary Users (Phase 1 - EMS)**

1.  **School Administrators**: Configure school settings, manage users, oversee operations

2.  **Teachers**: Mark attendance, create assignments, enter grades, communicate with parents

3.  **Students**: View timetables, submit assignments, check grades, access resources

4.  **Parents/Guardians**: Monitor student progress, attendance, grades; communicate with teachers

**Secondary Users (Phase 2 - IT Admin Dashboard)**

5.  **IT Administrators**: Manage system health, user permissions, backups, security, integrations

**User Personas**

- **Small to mid-sized schools** (100-2000 students) in the education sector

- Schools seeking to reduce operational costs by consolidating multiple tools

- Organizations requiring SSO integration (Google Workspace, Azure AD)

**3. Core User Flows**

**3.1 Administrator: School Setup**

1.  Admin logs in → completes school profile (name, logo, timezone, branding)

2.  Creates academic year with terms/semesters and holiday calendar

3.  Creates grade levels (e.g., Grade 1-12) and sections (e.g., 1-A, 1-B)

4.  Adds subjects and assigns them to grades

5.  Bulk imports students and teachers via CSV

6.  Assigns roles (Admin, Teacher, Student, Parent) to users

**3.2 Teacher: Attendance & Grading**

1.  Teacher logs in → views assigned classes

2.  Selects class and period → marks attendance (present/absent/late/excused)

3.  Creates assignment with due date and instructions

4.  Students submit assignments online

5.  Teacher enters grades into gradebook

6.  System calculates weighted averages and GPA

**3.3 Student: Assignment Submission**

1.  Student logs in → views dashboard with upcoming assignments

2.  Clicks assignment → reads instructions

3.  Uploads file or submits text response

4.  Views submission confirmation and timestamp

5.  Receives grade notification when teacher completes grading

**3.4 Parent: Progress Monitoring**

1.  Parent logs in → views dashboard showing all linked children

2.  Selects child → sees attendance percentage, recent grades, upcoming assignments

3.  Receives automated absence notification via email/SMS

4.  Sends message to teacher through in-app messaging

5.  Downloads/prints digital report card

**3.5 IT Admin: User Management (Phase 2)**

1.  IT Admin logs in → views system health dashboard

2.  Creates new user account or bulk imports users

3.  Assigns roles and permissions

4.  Monitors user activity logs

5.  Configures SSO settings for Google Workspace or Azure AD

**4. Feature List**

**MVP Features (V1 - Must Have)**

**4.1 Authentication & Access Control**

- User registration and login (email/password)

- Password reset workflow

- Role-based access control (Admin, Teacher, Student, Parent, Staff)

- SSO integration (Google Workspace, Azure AD)

- Multi-factor authentication (2FA with authenticator apps)

- Profile management (view/edit profile, upload photo)

**4.2 School Configuration (Admin)**

- School profile setup (name, logo, address, contact, timezone, currency)

- Academic year creation with terms/semesters

- Holiday calendar

- Grade/class/section creation

- Subject and curriculum setup

- Bulk user import/export (CSV)

- User role assignment

**4.3 Student Management**

- Student enrollment workflow

- Student profile (personal info, guardians, documents)

- Family/guardian management (multiple guardians per student)

- Student search and filtering

- Student transfer between classes

- Student withdrawal and archival

**4.4 Teacher & Staff Management**

- Teacher profile creation (credentials, subjects taught)

- Staff assignment to classes and departments

- Teacher directory with contact info

**4.5 Timetable & Scheduling**

- Master timetable creation (school hours, periods, breaks)

- Class schedule generation (assign subjects, teachers, rooms)

- Conflict detection (teacher/room double-booking)

- Timetable publication to students, parents, teachers

- Calendar integration (Google Calendar, Outlook)

**4.6 Attendance Management**

- Daily/period attendance marking by teachers

- Attendance status: present, absent, late, excused

- Bulk attendance entry

- Student attendance dashboard (percentage, history, calendar view)

- Automated absence notifications to parents (email/SMS)

- Attendance reports (daily, weekly, monthly, class-level)

**4.7 Assessment & Grading**

- Assignment creation with due dates and attachments

- Online assignment submission with timestamps

- Late submission detection

- Gradebook (multiple grades per subject, weighted averages)

- GPA calculation

- Grade reports and analytics

**4.8 Parent Portal & Communication**

- Parent account with multi-child support

- Parent dashboard (student profile, attendance %, recent grades, upcoming events)

- Parent-teacher messaging

- School announcements (school-wide or targeted by class/grade)

- Digital report cards (view/download/print)

**4.9 Incident & Behavior Management**

- Incident reporting (discipline, safety, academic)

- Incident severity levels

- Incident assignment to counselor/dean

- Behavior tracking and trend analysis

- Rewards and recognition logging

**4.10 Library Management**

- Book catalog (title, author, ISBN, categorization)

- Student borrowing and returns

- Due date tracking

- Overdue reminders and fine calculation

- Reading history per student

**4.11 Reports & Analytics**

- Student progress reports (grades, attendance, conduct)

- Bulk report card generation

- Attendance summaries (monthly, class-level, absentee trends)

- Grade distribution charts

- Data export (CSV, Excel, PDF)

**4.12 Mobile App & Notifications**

- Parent mobile app (iOS/Android) for profile, attendance, grades, messaging

- Teacher mobile app for attendance marking and grading

- Push notifications (mobile and web)

- Email and SMS notifications

- Notification preferences per user

**Phase 2 Features (IT Admin Dashboard - Must Have Post-Launch)**

**4.13 IT Admin Dashboard**

- System health monitoring (uptime, CPU, memory)

- User management (create, edit, delete, bulk operations)

- Role and permission management (custom roles, granular permissions)

- Group management (departments, teams)

- Activity logs (all user actions with timestamps)

- Security event logging (login attempts, role changes, suspicious activity)

**4.14 System Configuration**

- Global settings (language, timezone, currency, date formats)

- Module enable/disable toggles

- Email configuration (SMTP, templates, signatures)

- Integration settings (SSO, payment gateways, SMS, third-party APIs)

**4.15 Audit & Security**

- Comprehensive audit logging (create, edit, delete, view actions)

- Log search and filtering

- GDPR compliance reports

- Data access reports

- Retention policy enforcement

**4.16 Backup & Recovery**

- Automated daily backups (full and incremental)

- Manual backup triggers

- Backup integrity verification

- Point-in-time restore

- Disaster recovery testing

**4.17 Monitoring & Alerts**

- Real-time system monitoring

- Alert configuration (CPU, memory, disk thresholds)

- Incident creation for critical issues

- Alert recipients and severity levels

**Future Features (Post-V1 - Nice to Have)**

**Phase 3+: Additional Modules**

- **HR Management**: Recruitment, onboarding, payroll, performance reviews, leave management

- **Business Management (CRM/ERP)**: Lead management, sales pipeline, procurement, inventory, manufacturing, project management, asset management

- **Finance & Accounting**: General ledger, accounts payable/receivable, expense management, budgeting, bank reconciliation, tax management

- **Helpdesk/Support**: Ticket management, SLA tracking, knowledge base, customer portal

- **Facilities Management**: Room booking, maintenance management, safety audits, visitor management, environmental monitoring, lease management

**Advanced Features**

- Exam timetable and management

- Transport management (bus routes, student assignment)

- Workflow automation builder

- Custom field creation

- Advanced permissions

- Multi-language support

- White-label capabilities

- Offline mode

- Predictive analytics

- Custom dashboard builder

**5. Edge Cases & Error Handling**

**5.1 Authentication**

- **Invalid credentials**: Show clear error message, lock account after 5 failed attempts

- **Password reset with expired token**: Require new reset request

- **SSO account sync failure**: Log error, notify admin, allow manual account creation

- **2FA device lost**: Provide recovery codes during setup

**5.2 User Management**

- **Duplicate user import**: Detect duplicates by email, prompt admin to merge or skip

- **Parent linking to wrong student**: Require admin approval for parent-student links

- **Bulk import with malformed CSV**: Validate headers and data types, report errors clearly

**5.3 Scheduling**

- **Teacher double-booked**: Alert admin, prevent schedule save

- **Room conflict**: Alert admin, prevent schedule save

- **Student in multiple classes same time**: Alert admin, prevent enrollment

**5.4 Attendance**

- **Attendance marked after period ends**: Allow with timestamp, flag for audit

- **Student absent but marked present**: Allow correction with audit trail

- **Network failure during attendance save**: Cache locally, sync when connection restored

**5.5 Grading**

- **Grade entered outside valid range**: Show validation error, prevent save

- **Late submission after deadline**: Flag as late, allow teacher to accept or reject

- **GPA calculation error**: Log error, alert admin, recalculate on next cron job

**5.6 Communication**

- **Email delivery failure**: Log error, retry 3 times, notify admin if still failing

- **SMS gateway down**: Queue messages, retry when service restored

- **Parent account with multiple children**: Ensure correct child context in all notifications

**5.7 Data Integrity**

- **Student deleted with existing grades**: Archive student, preserve historical data

- **Academic year closed mid-term**: Prevent deletion, require admin override

- **Concurrent edits to same record**: Use last-write-wins with conflict notification

**6. Non-Goals (Out of Scope for V1)**

**Explicitly Excluded from MVP**

- **Learning Management System (LMS)**: Course content authoring, video hosting, interactive lessons (potential future integration)

- **Payment processing for fees**: Basic fee invoicing included, full payment gateway integration in future

- **Advanced analytics & AI**: Predictive modeling, machine learning for student risk identification (future enhancement)

- **Transportation tracking**: Real-time GPS tracking of school buses (basic route management only)

- **Cafeteria management**: Meal planning, dietary restrictions, billing (future module)

- **Alumni management**: Separate module for post-graduation tracking (future)

- **Admissions CRM**: Full applicant tracking and admissions workflow (future integration with CRM module)

- **Custom mobile app per school**: Single white-label app for all schools (future consideration)

- **Video conferencing**: Native video calls (integrate with Zoom/Teams via calendar)

**Technical Non-Goals for V1**

- On-premise deployment (cloud-only SaaS for V1)

- Native desktop applications (web-based only)

- Legacy system data migration tools (manual CSV import/export only)

- Multi-currency accounting (single currency per school in V1)

**7. Success Metrics**

**Product Metrics (First 6 Months Post-Launch)**

- **User Adoption**: 80% of teachers actively mark attendance weekly

- **Engagement**: 60% of parents log in monthly to check progress

- **System Usage**: Average session duration \>5 minutes for parents, \>15 minutes for teachers

- **Feature Utilization**: 70% of schools use gradebook, 90% use attendance

- **Mobile App Adoption**: 50% of parents download mobile app within 30 days

**Business Metrics**

- **Customer Acquisition**: 10 pilot schools onboarded in first 3 months

- **Retention**: 90% renewal rate after first year

- **NPS Score**: \>50 from school administrators

- **Support Tickets**: \<5% of users submit tickets per month

- **Time to Value**: Schools fully operational within 2 weeks of signup

**Technical Metrics**

- **System Uptime**: 99.5% availability

- **Page Load Time**: \<2 seconds for 95th percentile

- **API Response Time**: \<500ms for 95th percentile

- **Mobile App Crash Rate**: \<1%

- **Data Accuracy**: \<0.1% errors in attendance/grading calculations

**Efficiency Metrics (vs. Manual Processes)**

- **Time Savings**: 50% reduction in time spent on attendance tracking

- **Data Entry Reduction**: 70% fewer manual data entry tasks for admins

- **Communication Speed**: 80% faster parent notification delivery

- **Report Generation**: 90% faster report card generation

**8. Technical Considerations**

**8.1 Architecture Requirements**

- Multi-tenant SaaS architecture with data isolation

- RESTful APIs for all core functionality

- Responsive web design (mobile-first)

- Native mobile apps (iOS, Android) for parents and teachers

- Microservices for key modules (authentication, notifications, reports)

**8.2 Security Requirements**

- Data encryption at rest and in transit (TLS 1.3)

- Role-based access control with granular permissions

- Comprehensive audit logging (immutable)

- GDPR compliance (data export, deletion, consent management)

- Regular security audits and penetration testing

- Automated backup with point-in-time recovery

**8.3 Integration Requirements**

- SSO: Google Workspace (OAuth), Azure AD (SAML)

- Calendar: Google Calendar, Outlook Calendar (iCal)

- Email: SMTP for transactional emails

- SMS: Integration with SMS gateway (Twilio, etc.)

- Payment Gateway: Stripe/PayPal (Phase 2)

**8.4 Performance Requirements**

- Support 5,000 concurrent users per school

- Handle 10,000 students per school instance

- Real-time notification delivery (\<5 seconds)

- Batch processing for bulk operations (imports, report generation)

- Caching for frequently accessed data (timetables, profiles)

**8.5 Scalability**

- Horizontal scaling for application servers

- Database replication and sharding

- CDN for static assets and mobile app downloads

- Auto-scaling based on load

**9. Launch Strategy**

**9.1 MVP Launch (After Sprint 12, \~6 months)**

**What\'s Included:**

- Complete Education Management System (EMS)

- IT Admin Dashboard for system management

- Web application (responsive)

- Mobile apps (iOS, Android) for parents and teachers

**Launch Plan:**

1.  **Pilot Phase** (Months 1-2): 3-5 pilot schools, intensive onboarding support

2.  **Feedback & Iteration** (Month 3): Collect feedback, fix critical bugs, optimize workflows

3.  **Limited Release** (Months 4-6): Expand to 10-15 schools with proven onboarding process

4.  **General Availability** (Month 7+): Open to all schools with self-service onboarding

**9.2 Post-Launch Priorities**

1.  **Stability & Performance**: Monitor uptime, fix bugs, optimize slow queries

2.  **Customer Success**: Proactive onboarding support, training materials, help center

3.  **Feature Refinement**: Address top user requests from pilot schools

4.  **Mobile App Enhancements**: Offline mode, push notification improvements

5.  **Begin Phase 3**: Start development of HR Management module

**10. Open Questions & Decisions Needed**

**Product Decisions**

1.  **Pricing Model**: Per-student, per-school, or tiered plans? Freemium option?

2.  **Free Trial**: How long? Full feature access or limited?

3.  **Onboarding**: Self-service vs. white-glove for all schools?

4.  **Customization**: How much branding customization (colors, logos, themes)?

5.  **Data Retention**: How long to keep withdrawn student data? GDPR implications?

**Technical Decisions**

1.  **Tech Stack**: Confirm backend (Node.js, Python, Ruby?) and frontend (React, Vue?) frameworks

2.  **Database**: PostgreSQL, MySQL, or MongoDB for primary data store?

3.  **Hosting**: AWS, Google Cloud, or Azure?

4.  **Mobile Framework**: Native (Swift/Kotlin) or cross-platform (React Native, Flutter)?

5.  **Real-time Updates**: WebSockets, Server-Sent Events, or polling for live updates?

**Go-to-Market Decisions**

1.  **Target Geography**: UK-first, or multi-region launch?

2.  **Sales Strategy**: Direct sales, channel partners, or online self-service?

3.  **Marketing Channels**: SEO, paid ads, education conferences, partnerships?

4.  **Customer Support**: In-house team, outsourced, or community forum?

**11. Dependencies & Risks**

**Dependencies**

- **SSO Providers**: Reliable uptime for Google Workspace and Azure AD

- **SMS Gateway**: Twilio or equivalent for parent notifications

- **Email Service**: SendGrid or AWS SES for transactional emails

- **Hosting Provider**: Cloud infrastructure (AWS/GCP/Azure) availability

- **Mobile App Stores**: Apple App Store and Google Play approval process

**Risks & Mitigation**

| **Risk**                        | **Impact** | **Mitigation**                                              |
|---------------------------------|------------|-------------------------------------------------------------|
| **SSO integration delays**      | High       | Start integration early, have fallback email/password login |
| **Slow customer adoption**      | High       | Intensive pilot program, collect feedback, iterate quickly  |
| **Performance issues at scale** | High       | Load testing, database optimization, auto-scaling           |
| **Data privacy compliance**     | Critical   | Legal review, GDPR compliance from day one                  |
| **Mobile app rejection**        | Medium     | Follow app store guidelines, have web app as fallback       |
| **Competition from incumbents** | Medium     | Focus on SMB market, emphasize ease of use and cost savings |

**12. Appendix**

**Glossary**

- **EMS**: Education Management System

- **SSO**: Single Sign-On

- **RBAC**: Role-Based Access Control

- **MFA/2FA**: Multi-Factor Authentication

- **GPA**: Grade Point Average

- **SLA**: Service Level Agreement

- **GDPR**: General Data Protection Regulation
