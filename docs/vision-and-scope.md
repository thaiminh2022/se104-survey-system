# SE104 Survey System - Vision and Scope

## Business Requirements

### Background

SE104 Survey System is a web-based survey management application for creating, publishing, sharing, collecting, analyzing, and exporting survey data. The project is built with Next.js, React, TypeScript, Supabase, and a component-based dashboard interface.

The system supports two main user groups:

- Survey owners, who authenticate and manage surveys from a private dashboard.
- Respondents, who open public survey links and submit answers without needing an account.

The product focuses on the complete survey lifecycle: build a structured survey, publish it, distribute a link or QR code, collect responses, review analytics, and export results for reporting or later analysis.

Detailed ownership, access, lifecycle, response, analytics, export, and data protection rules are maintained in [Business Rules](business-rules.md).

### Business Opportunity

Students, instructors, small project teams, and event organizers often need a lightweight tool for collecting structured feedback without setting up complex enterprise survey software. Many academic or small-team survey workflows require multiple question types, public access for respondents, basic analytics, and exportable data, but do not need advanced collaboration, paid plans, or heavy configuration.

SE104 Survey System addresses this opportunity by providing a focused survey workspace that is simple enough for coursework and small research activities while still supporting practical reporting needs such as CSV exports, chart data, and print-ready analytics reports.

### Objective

| ID | Objective |
| --- | --- |
| BO-01 | Allow users to register, log in, and access a protected survey workspace. |
| BO-02 | Reduce the effort required to create multi-section surveys with varied question types. |
| BO-03 | Let survey owners publish, archive, share, and delete their own surveys. |
| BO-04 | Allow respondents to complete published surveys without account friction. |
| BO-05 | Give survey owners visibility into views, submissions, conversion, response timelines, and answer distributions. |
| BO-06 | Support downstream analysis through CSV exports, JSON chart reports, and print-ready PDF reports. |
| BO-07 | Protect management, analytics, export, and response data through authentication, ownership checks, and Supabase row-level security. |

### Success Metrics

| ID | Metric |
| --- | --- |
| SM-01 | A visitor can register or log in and reach the dashboard. |
| SM-02 | A survey owner can create a survey with at least one section and multiple question types. |
| SM-03 | A survey owner can save a survey as draft or publish it during creation. |
| SM-04 | A respondent can open and submit a published survey without signing in. |
| SM-05 | Draft and archived surveys are not publicly answerable. |
| SM-06 | Required questions block respondent progress until answered. |
| SM-07 | Survey owners can review survey-level metrics and answer charts for owned surveys. |
| SM-08 | Survey owners can export raw responses and analytics reports for owned surveys. |
| SM-09 | Automated unit and end-to-end tests cover the main authentication, creation, response, analytics, and export flows. |

### Business Risk

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Supabase service dependency | Authentication, database access, and row-level security depend on Supabase availability and correct configuration. | Document required environment variables and support hosted or local Supabase setup. |
| Data access mistakes | Survey data could be exposed to the wrong user if ownership checks are incomplete. | Use protected dashboard routes, server-side owner filters, and Supabase row-level security policies. |
| Public survey state confusion | Owners may share links for draft or archived surveys and expect them to work. | Enforce published-only access in the public survey loader. |
| Incomplete editing support | Users may expect to edit existing surveys after creation. | Treat full editing as future scope and keep the current edit placeholder out of initial-release commitments. |
| Browser-dependent PDF output | Print-to-PDF reports can vary by browser and print settings. | Keep the report page simple, print-ready, and suitable for browser printing. |
| Academic project constraints | Time and team capacity limit advanced features such as teams, branching, templates, and offline collection. | Prioritize the core survey lifecycle and document exclusions clearly. |

## Vision

### Vision Statement

SE104 Survey System will provide a focused, reliable survey workspace where users can create structured surveys, share them publicly, collect responses, understand results, and export useful data without the overhead of a large enterprise survey platform.

The intended experience is direct and practical: survey owners should be able to move from survey idea to published response link quickly, and respondents should be able to complete a survey with minimal friction.

### Major Features

| Feature | Description |
| --- | --- |
| Authentication and access control | Email/password registration, login, logout, protected dashboard routes, safe return URLs, and Supabase-backed sessions. |
| Dashboard overview | Workspace metrics for total surveys, published surveys, views, submissions, and recent surveys. |
| Survey builder | Multi-section survey creation with title, description, required flags, and type-specific question configuration. |
| Question type support | Single choice, multiple choice, rating scale, Likert scale, short text, long text, dropdown, yes/no, matrix, ranking, date/time, consent, and number questions. |
| Survey lifecycle management | Draft, published, and archived survey states, with owner-only listing, state changes, and deletion. |
| Public sharing | Public survey URL generation, share actions, and QR code display. |
| Response collection | Public response pages, section-by-section navigation, required-answer validation, anonymous submissions, and success confirmation. |
| Analytics | Survey-level views, submissions, conversion rate, submission timeline, and answer distribution charts. |
| Exports | CSV response export, JSON chart report export, and print-ready analytics report page for PDF generation. |
| Security controls | Dashboard authentication, owner-scoped reads and mutations, route protection, and Supabase row-level security. |
| Automated testing | Unit and end-to-end tests for core helpers, actions, exports, routing, survey creation, public responses, and analytics. |

### Assumptions and Dependencies

| Type | Assumption or dependency |
| --- | --- |
| Platform | The app runs as a Next.js 16 App Router application with React 19 and TypeScript. |
| Package manager | Development and scripts use pnpm. |
| Authentication | Supabase Auth is available for registration, login, logout, and session validation. |
| Database | Supabase Database is available and migrated with the committed schema. |
| Configuration | The app is configured with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`. |
| Browser | Users access the app through modern desktop or mobile browsers. |
| Reporting | PDF export uses the browser print dialog from a print-ready report page. |
| Email confirmation | Account confirmation behavior depends on the configured Supabase project settings. |

## Scope and Limitations

### Scope of Initial and Subsequent Releases

| Release | Included scope |
| --- | --- |
| Initial release | Authentication, protected dashboard, survey creation, survey list, publish/archive actions, deletion, public survey responses, link and QR sharing, analytics pages, CSV export, JSON report export, print-ready PDF report page, and automated tests for core flows. |
| Subsequent releases | Full survey editing, survey duplication, reusable templates, conditional branching between sections, stronger report customization, direct server-side PDF generation, team workspaces, role-based collaboration, improved partial-response recovery, and richer respondent tracking. |

### Limitations and Exclusions

| Limitation or exclusion | Current status |
| --- | --- |
| Full survey editing | The edit route exists, but the UI is currently a placeholder. |
| Republish archived survey | Current status flow allows draft to published and published to archived, but not archived back to published. |
| Team workspaces and roles | The current data model uses individual survey ownership only. |
| Survey templates | No template model or template UI is implemented. |
| Conditional branching | Section behavior fields exist in the schema, but the active builder and respondent flow use linear section navigation. |
| Payment or subscription features | Not part of the current academic project scope. |
| Native server-side PDF generation | Current PDF flow uses browser printing from a print-ready page. |
| Offline response collection | The app requires a live web connection and database access. |
| Enterprise administration | No organization-level administration, audit trail, or centralized policy management is included. |

## Business Context

### Stakeholder Profile

| Stakeholder | Interest or need |
| --- | --- |
| Student or project member | Quickly create surveys for coursework, research, product feedback, or team assignments. |
| Instructor or evaluator | Review a functional software project with clear requirements, implemented workflows, and test coverage. |
| Event organizer or small team lead | Share surveys through links or QR codes and collect responses from a defined audience. |
| Survey respondent | Complete a published survey with clear navigation and no account requirement. |
| Development team | Maintain a TypeScript-based application with documented scope, repeatable setup, and automated tests. |
| Supabase platform | Provides the external authentication, database, and row-level security services required by the system. |

### Project Priorities

| Priority | Description |
| --- | --- |
| Core lifecycle first | Creation, publishing, public response collection, analytics, and export are the highest-value workflow. |
| Security and ownership | Dashboard access, management actions, analytics, and exports must stay scoped to the authenticated owner. |
| Respondent simplicity | Public surveys should be answerable without sign-in and should clearly block missing required answers. |
| Practical reporting | Owners need enough metrics and export formats to use collected data outside the app. |
| Maintainability | The codebase should remain typed, tested, and organized around clear actions, components, stores, and export utilities. |
| Scope discipline | Advanced collaboration, templates, branching, and native PDF generation are deferred until the core workflow is stable. |

### Operating Environment

| Area | Environment |
| --- | --- |
| Runtime | Node.js with pnpm scripts for development, build, linting, and tests. |
| Web framework | Next.js 16 App Router. |
| Frontend | React 19, TypeScript, Tailwind CSS, shadcn-style components, Zustand, and React Hook Form. |
| Backend services | Supabase Auth and Supabase Database. |
| Analytics and exports | Recharts, CSV generation utilities, JSON chart report output, and browser print-to-PDF. |
| Testing | Vitest for unit tests and Playwright for end-to-end browser tests. |
| Deployment configuration | Environment variables provide the Supabase URL, Supabase publishable key, and public site URL. |
| Supported clients | Modern desktop and mobile browsers with network access to the deployed app and Supabase services. |
