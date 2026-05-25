# SE104 Survey System - Software Requirements Specification

## 1. Purpose

### 1.1 Definition

This Software Requirements Specification defines the functional and non-functional requirements for SE104 Survey System, a web application for creating surveys, collecting responses, analyzing results, and exporting survey data.

| Term | Definition |
| --- | --- |
| Survey Owner | Authenticated user who creates and manages surveys. |
| Respondent | Person who answers a published survey. |
| Survey | A questionnaire with title, description, sections, questions, state, view count, and submission count. |
| Section | A grouping of questions within a survey. |
| Question | A prompt configured with a question type, required flag, and type-specific settings. |
| Submission | One completed survey response. |
| Answer | One response to one question within a submission. |
| Draft | Survey state for unpublished surveys. |
| Published | Survey state for surveys accessible through public links. |
| Archived | Survey state for surveys no longer publicly answerable. |

### 1.2 Background

SE104 Survey System is an academic web application project for small-team and coursework survey workflows. It addresses the need for a lightweight tool that lets authenticated users build structured surveys, distribute them publicly, collect answers without respondent account friction, review results, and export data for reports or analysis.

### 1.3 System Overview

The system supports authenticated survey owners and public respondents. Survey owners can create and edit multi-section surveys with multiple question types, publish or archive surveys, share public links and QR codes, inspect analytics, and export results. Respondents can open published survey links and submit answers without signing in.

The detailed business rules for ownership, survey state, public access, response collection, analytics, exports, and current constraints are maintained in [Business Rules](business-rules.md).

### 1.4 References

| Document | Purpose |
| --- | --- |
| [Vision and Scope](vision-and-scope.md) | Business requirements, product vision, scope, limitations, and business context. |
| [Business Rules](business-rules.md) | Ownership, lifecycle, access, response, analytics, export, and data protection rules. |
| [Use Cases](use-cases.md) | Actor goals and detailed interaction flows. |
| [README](../README.md) | Setup, scripts, technology stack, testing, and project structure. |

## 2. Overall Description

### 2.1 Product Perspective

SE104 Survey System is a standalone Next.js 16 App Router application using React 19, TypeScript, Supabase Auth, Supabase Database, Zustand, React Hook Form, Recharts, and shadcn-style UI components. It relies on Supabase for identity, persistence, and row-level security, while the application implements dashboard pages, public survey pages, server actions, route handlers, exports, and charts.

#### 2.1.1 System Interface

The system exposes browser-accessible routes for the homepage, authentication, dashboard, survey management, public survey response, analytics, and export pages. It uses server actions and route handlers for authentication, survey persistence, response submission, analytics reads, and export generation.

#### 2.1.2 User Interface

The system includes these user-facing interfaces:

- Public homepage.
- Login and registration pages.
- Dashboard overview.
- Survey list and survey actions menu.
- Survey create/edit builder.
- Survey access controls for optional respondent email allowlists.
- Survey sharing page with link and QR code.
- Public survey response page.
- Analytics list and survey analytics detail pages.
- Export configuration page.
- Print-ready analytics report page.

#### 2.1.3 Hardware Interface

No dedicated hardware interface is required. Users access the system from standard desktop or mobile devices with a modern web browser and network connection.

#### 2.1.4 Software Interface

| Software | Interface role |
| --- | --- |
| Supabase Auth | Registration, login, logout, sessions, and user identity. |
| Supabase Database | Persisted surveys, sections, questions, submissions, answers, counters, and access policies. |
| Browser print dialog | Print-to-PDF workflow for analytics reports. |
| Recharts | Chart rendering for analytics views. |
| React QR Code | QR code rendering for survey sharing. |

#### 2.1.5 Communication Interface

The web client communicates with the Next.js application over HTTP or HTTPS. The application communicates with Supabase services through the configured Supabase URL and publishable key. Public survey links are generated from `NEXT_PUBLIC_SITE_URL`.

#### 2.1.6 Memory Constraints

No special memory constraints are defined. The system is expected to run within normal Node.js hosting limits and modern browser memory limits for small to moderate survey datasets.

### 2.2 Design Constraints

#### 2.2.1 Operations

- The application must run with Node.js and pnpm.
- Dashboard routes must require an authenticated session.
- Public survey response pages must only load surveys in `published` state.
- Restricted surveys must require a signed-in respondent whose email is listed by the survey owner.
- Survey ownership must be enforced for dashboard reads, mutations, analytics, and exports.
- Server-side mutations must verify authentication and authorization.
- The application must rely on Supabase row-level security policies and application-level owner filters.
- Browser printing is used for PDF report output.
- Business rules that affect these constraints are centralized in [Business Rules](business-rules.md).

#### 2.2.2 Site Adaptation Requirements

- The deployment environment must provide `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`.
- The Supabase database must be migrated with the committed schema before production use.
- Supabase email confirmation behavior may vary by project settings.
- The public site URL must match the deployed app origin so generated survey links and QR codes resolve correctly.

### 2.3 Product Functions

| Function | Description |
| --- | --- |
| Authentication | Register, log in, log out, protect dashboard routes, and sanitize return URLs. |
| Dashboard | Show workspace metrics, recent surveys, and navigation. |
| Survey creation | Build surveys with title, description, sections, questions, required flags, type-specific settings, and optional respondent email allowlists. |
| Survey management | List owned surveys, edit existing surveys, publish drafts, archive published surveys, and delete surveys after confirmation. |
| Sharing | Generate a public survey URL and QR code for distribution. |
| Public response collection | Display published surveys, validate required answers, store submissions, and show confirmation. |
| Analytics | Show views, submissions, conversion, submission timeline, and answer distributions. |
| Export | Export CSV response data, JSON analytics report data, and print-ready PDF reports. |

### 2.4 User Characteristics

| User class | Characteristics |
| --- | --- |
| Visitor | Can view the public homepage, register, log in, and open published survey links. |
| Respondent | Can complete published surveys section by section without needing an account. |
| Survey Owner | Can use the authenticated dashboard to create, manage, share, analyze, and export owned surveys. |
| Development Team | Maintains a TypeScript and Supabase-based codebase with automated unit and end-to-end tests. |

### 2.5 Constraints

- The current data model uses individual survey ownership only.
- Archived surveys cannot be republished through the current UI.
- The respondent flow is linear by section; conditional branching is not implemented.
- No team, organization, role, or collaboration model is implemented.
- No survey template library is implemented.
- No offline response collection is implemented.
- No native server-side PDF file generation is implemented.

### 2.6 Assumptions

- Users have access to a modern desktop or mobile browser.
- Survey owners have valid credentials and access to their email if Supabase email confirmation is enabled.
- Respondents have network access to the deployed public survey URL.
- Survey datasets remain small to moderate for the current academic project scope.
- Browser printing is acceptable for generating PDF reports in the current release.

### 2.7 Dependencies

- Supabase Auth must be available for account management and session validation.
- Supabase Database must be available for persisted surveys, responses, analytics source data, and row-level security.
- The committed database migration must match the application data model.
- Next.js, React, TypeScript, and related package dependencies must be installed through pnpm.
- Playwright and Vitest are used for automated test coverage.

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces

| ID | Requirement | Priority |
| --- | --- | --- |
| EIR-UI-01 | The system shall provide login and registration pages for visitors. | Must |
| EIR-UI-02 | The system shall provide a protected dashboard for authenticated users. | Must |
| EIR-UI-03 | The system shall provide a survey builder interface for creating and editing sections and questions. | Must |
| EIR-UI-04 | The system shall provide a survey list with management actions. | Must |
| EIR-UI-05 | The system shall provide a sharing page with public link and QR code. | Should |
| EIR-UI-06 | The system shall provide public response pages for published surveys. | Must |
| EIR-UI-07 | The system shall provide analytics and export pages for owned surveys. | Must |
| EIR-UI-08 | The system shall provide a print-ready analytics report page. | Should |

#### 3.1.2 External Software Interfaces

| ID | Requirement | Priority |
| --- | --- | --- |
| EIR-SW-01 | The system shall use Supabase Auth for user identity and session operations. | Must |
| EIR-SW-02 | The system shall use Supabase Database for persisted survey and response data. | Must |
| EIR-SW-03 | The system shall use Supabase row-level security for database-level data protection. | Must |
| EIR-SW-04 | The system shall use the browser print dialog for PDF report output. | Should |

### 3.2 Performance Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| PR-01 | The dashboard shall load owned survey summary data without requiring the user to open each survey individually. | Should |
| PR-02 | Public survey pages shall validate required answers in the browser before attempting final submission. | Must |
| PR-03 | Analytics pages shall aggregate views, submissions, conversion, timeline, and answer distributions from persisted data. | Should |
| PR-04 | Export routes shall return CSV or JSON output directly for owned surveys without requiring manual data copying. | Must |

### 3.3 Software System Attributes

#### 3.3.1 Reliability

| ID | Requirement | Priority |
| --- | --- | --- |
| SSA-REL-01 | The system shall keep persisted submission counts non-negative. | Must |
| SSA-REL-02 | The system shall handle failed database operations with user-visible or route-level errors. | Must |
| SSA-REL-03 | The system shall prevent public response submission to draft or archived surveys. | Must |

#### 3.3.2 Availability

| ID | Requirement | Priority |
| --- | --- | --- |
| SSA-AVL-01 | The system shall remain available when its hosting environment and Supabase services are available. | Should |
| SSA-AVL-02 | Public survey links shall remain usable while the linked survey exists and is published. | Must |
| SSA-AVL-03 | Dashboard and export features may depend on authenticated Supabase session availability. | Must |

#### 3.3.3 Security

| ID | Requirement | Priority |
| --- | --- | --- |
| SSA-SEC-01 | The system shall protect dashboard pages from unauthenticated access. | Must |
| SSA-SEC-02 | The system shall enforce survey ownership for management, analytics, and exports. | Must |
| SSA-SEC-03 | The system shall sanitize return URLs to prevent unsafe redirects. | Must |
| SSA-SEC-04 | The system shall rely on Supabase row-level security for database-level access control. | Must |
| SSA-SEC-05 | The repository shall not commit real Supabase secrets, service role keys, database passwords, or JWT secrets. | Must |

#### 3.3.4 Maintainability

| ID | Requirement | Priority |
| --- | --- | --- |
| SSA-MAINT-01 | The codebase shall use TypeScript types for survey, section, question, submission, answer, chart, and export shapes. | Must |
| SSA-MAINT-02 | The codebase shall keep survey actions, Supabase clients, stores, exports, charts, and types in organized modules. | Should |
| SSA-MAINT-03 | The codebase shall include automated unit and end-to-end tests for core behavior. | Should |
| SSA-MAINT-04 | Framework-specific changes shall follow the Next.js 16 documentation in `node_modules/next/dist/docs/`. | Must |

#### 3.3.5 Portability

| ID | Requirement | Priority |
| --- | --- | --- |
| SSA-PORT-01 | The system shall run in environments that support Node.js, pnpm, and Next.js. | Must |
| SSA-PORT-02 | The system shall support hosted Supabase or local Supabase development when environment variables are configured. | Should |
| SSA-PORT-03 | The user interface shall support modern desktop and mobile browsers. | Should |

### 3.4 Functional Requirements

#### 3.4.1 Authentication

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-AUTH-01 | The system shall allow visitors to register with email, password, and password confirmation. | Must |
| FR-AUTH-02 | The system shall reject registration when password and confirmation do not match. | Must |
| FR-AUTH-03 | The system shall allow registered users to log in with email and password. | Must |
| FR-AUTH-04 | The system shall redirect unauthenticated users from dashboard routes to login with a return URL. | Must |
| FR-AUTH-05 | The system shall allow authenticated users to log out. | Must |
| FR-AUTH-06 | The system shall sanitize return URLs to prevent unsafe redirects. | Must |

#### 3.4.2 Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-DASH-01 | The system shall show total surveys owned by the authenticated user. | Must |
| FR-DASH-02 | The system shall show the number of published surveys. | Must |
| FR-DASH-03 | The system shall show total survey views and submissions across owned surveys. | Must |
| FR-DASH-04 | The system shall show recent surveys for quick navigation. | Should |
| FR-DASH-05 | The system shall provide dashboard navigation to overview, surveys, create survey, and analytics. | Must |

#### 3.4.3 Survey Creation

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-SURVEY-01 | The system shall allow an authenticated user to create a survey with title and description. | Must |
| FR-SURVEY-02 | The system shall allow a survey to contain one or more sections. | Must |
| FR-SURVEY-03 | The system shall allow sections to contain questions. | Must |
| FR-SURVEY-04 | The system shall allow users to add and remove sections, while keeping at least one section in the builder. | Should |
| FR-SURVEY-05 | The system shall allow users to add and remove questions. | Must |
| FR-SURVEY-06 | The system shall allow users to configure question title, description, type, required flag, and type-specific settings. | Must |
| FR-SURVEY-07 | The system shall support single choice, multiple choice, rating scale, Likert scale, short text, long text, dropdown, yes/no, matrix, ranking, date/time, consent, and number questions. | Must |
| FR-SURVEY-08 | The system shall allow a new survey to be saved as draft. | Must |
| FR-SURVEY-09 | The system shall allow a new survey to be published during creation. | Must |
| FR-SURVEY-10 | The system shall persist surveys, sections, and questions in the database. | Must |

#### 3.4.4 Survey Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-MGMT-01 | The system shall list surveys owned by the authenticated user. | Must |
| FR-MGMT-02 | The system shall display each survey's title, description, state, and creation date. | Must |
| FR-MGMT-03 | The system shall allow owners to publish draft surveys. | Must |
| FR-MGMT-04 | The system shall allow owners to archive published surveys. | Must |
| FR-MGMT-05 | The system shall prevent archived surveys from being publicly answered. | Must |
| FR-MGMT-06 | The system shall allow owners to delete their own surveys after confirmation. | Must |
| FR-MGMT-07 | The system shall allow owners to edit existing surveys after creation. | Must |

#### 3.4.5 Sharing

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-SHARE-01 | The system shall generate a public survey URL using the configured site URL and survey id. | Must |
| FR-SHARE-02 | The system shall display share actions for the public link. | Must |
| FR-SHARE-03 | The system shall display a QR code for the public survey URL. | Should |
| FR-SHARE-04 | The system shall not make draft or archived surveys answerable merely because a link exists. | Must |
| FR-SHARE-05 | The system shall allow survey owners to restrict a survey to a list of respondent email addresses. | Must |
| FR-SHARE-06 | The system shall treat a survey with no allowed respondent emails as public. | Must |

#### 3.4.6 Survey Response

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-RESP-01 | The system shall allow respondents to open unrestricted published surveys without signing in. | Must |
| FR-RESP-02 | The system shall reject public access to draft and archived surveys. | Must |
| FR-RESP-03 | The system shall present survey sections one at a time. | Must |
| FR-RESP-04 | The system shall allow respondents to navigate backward and forward between sections. | Should |
| FR-RESP-05 | The system shall prevent proceeding or submitting when required questions in the current section are unanswered. | Must |
| FR-RESP-06 | The system shall store one submission for each completed response. | Must |
| FR-RESP-07 | The system shall store answer records associated with the submission and questions. | Must |
| FR-RESP-08 | The system shall allow anonymous submissions with null user id. | Must |
| FR-RESP-09 | The system shall associate a submission with a user id when the respondent is authenticated. | Should |
| FR-RESP-10 | The system shall show a success message after submission. | Must |
| FR-RESP-11 | The system shall require login before opening a restricted published survey. | Must |
| FR-RESP-12 | The system shall reject restricted survey access and submission when the signed-in user's email is not allowed. | Must |

#### 3.4.7 Analytics

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-ANALYTICS-01 | The system shall show survey-level views, submissions, conversion, and state. | Must |
| FR-ANALYTICS-02 | The system shall calculate conversion as submissions divided by views, using zero when view count is zero. | Must |
| FR-ANALYTICS-03 | The system shall show submission counts over time. | Should |
| FR-ANALYTICS-04 | The system shall show answer distributions for chartable questions. | Should |
| FR-ANALYTICS-05 | The system shall only show analytics for surveys owned by the authenticated user. | Must |

#### 3.4.8 Export

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-EXPORT-01 | The system shall export raw survey response data as CSV. | Must |
| FR-EXPORT-02 | The system shall support long CSV format with one row per answer. | Must |
| FR-EXPORT-03 | The system shall support wide CSV format with one row per submission. | Should |
| FR-EXPORT-04 | The system shall allow CSV options for submission metadata, question metadata, and empty answers. | Should |
| FR-EXPORT-05 | The system shall export analytics report data as JSON. | Must |
| FR-EXPORT-06 | The system shall support report options for summary metrics, submission timeline, and answer distributions. | Should |
| FR-EXPORT-07 | The system shall redirect PDF report requests to a print-ready report page. | Should |
| FR-EXPORT-08 | The system shall return 401 for unauthenticated export requests. | Must |
| FR-EXPORT-09 | The system shall return 404 when an authenticated user requests export for a survey they do not own. | Must |

### 3.5 Non-Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-USAB-01 | The system shall provide a responsive UI for desktop and mobile browser widths. | Should |
| NFR-USAB-02 | The system shall clearly indicate validation errors and blocked required-question navigation. | Should |
| NFR-DATA-01 | The system shall persist surveys, sections, questions, submissions, and answers according to the committed database schema. | Must |
| NFR-DATA-02 | The system shall maintain survey state rules for draft, published, and archived surveys. | Must |
| NFR-TEST-01 | Unit tests should cover helper functions, auth actions, create/update survey actions, response submission, survey store behavior, publish and response validation, exports, chart aggregation, and route handlers. | Should |
| NFR-TEST-02 | End-to-end tests should cover auth routing, public response behavior, create and edit survey builder flows, analytics, exports, and API routes. | Should |

### 3.6 Other

#### 3.6.1 Main Data Entities

| Entity | Key attributes |
| --- | --- |
| Survey | `id`, `user_id`, `title`, `description`, `state`, `image`, `submission_count`, `view_count`, `created_at` |
| SurveyAllowedRespondent | `id`, `survey_id`, `email`, `created_at` |
| Section | `id`, `survey_id`, `order_index`, `title`, `description`, `end_behavior`, `config`, `created_at` |
| Question | `id`, `section_id`, `order_index`, `title`, `description`, `question_type`, `config`, `required`, `created_at` |
| Submission | `id`, `survey_id`, `user_id`, `submitted_at`, `created_at` |
| Answer | `id`, `submission_id`, `question_id`, `answer_data`, `created_at` |

#### 3.6.2 State Rules

| State | Meaning |
| --- | --- |
| Draft | Owned by creator, not publicly answerable. |
| Published | Publicly answerable and counted in public access. |
| Archived | Retained for owner management and analytics, not publicly answerable. |

#### 3.6.3 Acceptance Criteria

- An unauthenticated user who opens `/dashboard` is redirected to login.
- An authenticated user can create a survey with sections and questions.
- A survey owner can open an existing survey in the edit builder and save changes.
- A draft survey is not publicly answerable.
- A published survey can be opened at `/surveys/{id}` and submitted.
- A restricted published survey redirects unauthenticated respondents to login and rejects signed-in users whose email is not listed.
- Required questions block respondent progress until answered.
- A survey owner can see view, submission, and conversion metrics.
- A survey owner can export CSV response data for owned surveys.
- A survey owner can export JSON analytics reports and open printable PDF reports.
- A user cannot export analytics for another user's survey.
