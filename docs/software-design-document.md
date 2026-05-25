# SE104 Survey System - Software Design Document

## 1. Introduction and Overview

### 1.1 Purpose

This Software Design Document describes the architecture, data design, interfaces, components, user interface structure, assumptions, dependencies, and terminology for SE104 Survey System.

### 1.2 Scope

The design covers the current survey management application: authentication, protected dashboard, survey creation and editing, survey state management, public response collection, analytics, CSV export, JSON report export, and print-ready PDF reporting.

### 1.3 References

| Document | Purpose |
| --- | --- |
| [Software Requirements Specification](software-requirements-specification.md) | Functional and non-functional requirements. |
| [Business Rules](business-rules.md) | Ownership, state, access, response, analytics, export, and data protection rules. |
| [Use Cases](use-cases.md) | Actor goals and interaction flows. |
| [Vision and Scope](vision-and-scope.md) | Business context, scope, and limitations. |
| [README](../README.md) | Setup, scripts, test commands, and project layout. |

## 2. System Architecture

### 2.1 Architectural Style

SE104 Survey System is a web application built with the Next.js 16 App Router. It uses a layered architecture:

| Layer | Responsibility | Main locations |
| --- | --- | --- |
| Presentation | Pages, layouts, forms, dashboard views, public survey views, charts, and export screens. | `app/`, `components/` |
| Client state | In-browser survey builder state and answer-writing helpers. | `lib/stores/`, `components/surveys/response/` |
| Application actions | Server-side operations for auth, survey creation, survey reads, analytics reads, and response submission. | `lib/actions/` |
| Integration | Supabase browser, server, and proxy clients. | `lib/supabase/`, `proxy.ts` |
| Domain utilities | Survey types, database schemas, chart builders, CSV builders, and report builders. | `lib/types/`, `lib/charts/`, `lib/exports/` |
| Persistence | Supabase tables, constraints, triggers, and row-level security policies. | `supabase/migrations/` |
| Verification | Unit and end-to-end tests. | `__tests__/` |

### 2.2 Runtime View

The app has two primary runtime flows:

| Flow | Description |
| --- | --- |
| Authenticated owner flow | A visitor logs in or registers, `proxy.ts` protects dashboard routes, dashboard pages call server actions, server actions use the Supabase server client, and Supabase returns only authorized owner-scoped data. |
| Public respondent flow | A respondent opens `/surveys/{id}`, the app loads only a published survey, the response form validates required answers by section, and submission actions persist one submission plus related answer rows. |

### 2.3 Major Subsystems

| Subsystem | Design |
| --- | --- |
| Authentication | Supabase Auth handles identity and sessions. `lib/actions/auth.ts` processes login, registration, logout, and safe return redirects. |
| Route protection | `proxy.ts` redirects unauthenticated users away from dashboard routes and preserves safe return URLs. |
| Survey builder | Client components use `useSurveyStore` in `lib/stores/survey_store.ts` to manage survey, section, question, required flag, ordering, question configuration, and allowed respondent email state before persistence. |
| Survey persistence | `lib/actions/create_survey.ts` converts builder state into survey, section, question, and allowed respondent inserts or updates. Existing survey edits update the survey row, replace the allowlist, delete removed child rows, and upsert the current section and question rows. |
| Survey reads | `lib/actions/read_survey.ts` loads owned surveys, recent surveys, fake E2E survey data, and published public surveys. |
| Response collection | Public response components collect answers and call `lib/actions/submit_survey_response.ts` to enforce public access rules, validate answers, and create submissions and answers. |
| Analytics | `lib/actions/read_analytics.ts` loads owner-scoped analytics data; `lib/charts/` transforms persisted data into chart-ready series. |
| Exports | CSV and chart report utilities in `lib/exports/` generate downloadable data. Route handlers under `app/dashboard/analytics/[id]/export/` expose CSV and JSON exports. |
| UI components | `components/ui/` contains reusable shadcn-style primitives; feature components are grouped by dashboard, survey creation, survey response, auth, and homepage areas. |

### 2.4 Deployment View

The system is deployed as a Next.js application connected to Supabase. Required runtime configuration is supplied through:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

The application can run against a hosted Supabase project or a local Supabase instance initialized from the committed migration.

## 3. Data Design

### 3.1 Data Model

The core relational model is:

| Entity | Key attributes | Relationships |
| --- | --- | --- |
| Survey | `id`, `user_id`, `title`, `description`, `state`, `image`, `submission_count`, `view_count`, `created_at` | Owned by one user; has many sections and submissions. |
| SurveyAllowedRespondent | `id`, `survey_id`, `email`, `created_at` | Belongs to one survey; presence of rows restricts response access to matching authenticated emails. |
| Section | `id`, `survey_id`, `order_index`, `title`, `description`, `end_behavior`, `config`, `created_at` | Belongs to one survey; has many questions. |
| Question | `id`, `section_id`, `order_index`, `title`, `description`, `question_type`, `config`, `required`, `created_at` | Belongs to one section; has many answers. |
| Submission | `id`, `survey_id`, `user_id`, `submitted_at`, `created_at` | Belongs to one survey; may belong to a respondent user; has many answers. |
| Answer | `id`, `submission_id`, `question_id`, `answer_data`, `created_at` | Belongs to one submission and one question. |

### 3.2 Type Design

Application data shapes are defined in `lib/types/`:

| File | Design role |
| --- | --- |
| `question-type.ts` | Client survey builder types, supported question types, and per-question configuration shapes. |
| `answer-type.ts` | Respondent answer form and answer payload types. |
| `db_schema.ts` | Zod schemas and TypeScript types for persisted survey, section, question, submission, and answer rows. |
| `charts.ts` | Chart series types for views and submissions. |
| `errors.ts` | Shared action result type for success and error states. |

### 3.3 Survey State Design

| State | Design behavior |
| --- | --- |
| `draft` | Owner-visible and manageable, but not publicly answerable. |
| `published` | Publicly readable and answerable through `/surveys/{id}`. |
| `archived` | Owner-visible for management and analytics, but not publicly answerable. |

### 3.4 Data Integrity

- Supabase row-level security protects database-level access.
- Application actions add owner filters for management, analytics, and exports.
- Restricted survey access is enforced by the public survey loader, response submission action, and Supabase policies using the allowed respondent table.
- Database constraints keep `submission_count` and `view_count` non-negative.
- A database trigger maintains survey submission counts when submissions change.
- Survey deletion cascades through dependent sections, questions, submissions, and answers.

## 4. Interface Design

### 4.1 User-Facing Routes

| Route | Purpose |
| --- | --- |
| `/` | Public homepage. |
| `/auth/login` | Login form. |
| `/auth/register` | Registration form. |
| `/dashboard` | Owner dashboard overview. |
| `/dashboard/surveys` | Owned survey list and management actions. |
| `/dashboard/surveys/create` | New survey builder. |
| `/dashboard/surveys/[id]/share` | Public link and QR code sharing page. |
| `/dashboard/surveys/[id]/edit` | Edit builder for an owned survey. |
| `/surveys/[id]` | Public published survey response page. |
| `/dashboard/analytics` | Owner analytics list. |
| `/dashboard/analytics/[id]` | Survey analytics detail page. |
| `/dashboard/analytics/[id]/export` | Export configuration page. |
| `/dashboard/analytics/[id]/export/pdf` | Print-ready report page. |

### 4.2 Route Handler Interfaces

| Route handler | Output |
| --- | --- |
| `/dashboard/analytics/[id]/export/csv` | CSV attachment for owned survey responses. |
| `/dashboard/analytics/[id]/export/charts` | JSON chart report for owned survey analytics. |

### 4.3 External Service Interfaces

| Service | Interface |
| --- | --- |
| Supabase Auth | Email/password registration, email/password login, logout, session retrieval, and user identity. |
| Supabase Database | Survey, section, question, submission, and answer reads/writes through Supabase clients. |
| Browser print | PDF export through print-ready page and `window.print()`. |

### 4.4 Internal Action Interfaces

| Action module | Responsibility |
| --- | --- |
| `auth.ts` | Register, login, logout, and return URL handling. |
| `create_survey.ts` | Create new surveys and update existing builder surveys as survey, allowed respondent, section, and question rows. |
| `read_survey.ts` | Load owned surveys, recent surveys, and published public surveys. |
| `submit_survey_response.ts` | Persist submissions and answers. |
| `read_analytics.ts` | Load owner-scoped analytics data and answer distributions. |
| `read_user.ts` | Load authenticated user data. |

## 5. Component Design

### 5.1 Application Components

| Component group | Responsibility |
| --- | --- |
| `components/auth/` | Login and registration forms. |
| `components/dashboard/survey-create/` | Survey builder header, sections, toolbar, question editor, and question-type editors. |
| `components/dashboard/surveys/` | Survey actions, state-change button, delete button, and sharing UI. |
| `components/dashboard/analytics/` | Submission charts and question answer charts. |
| `components/surveys/` | Public survey response section, form, question field, and response inputs. |
| `components/ui/` | Shared UI primitives such as buttons, cards, inputs, select controls, charts, dialogs, and sidebar. |

### 5.2 Survey Builder Design

The survey builder uses `useSurveyStore` as the primary client-side state holder. Its state contains one survey, an optional allowed respondent email list, a list of sections, and each section's questions. Store actions add and delete sections, add and delete questions, update question type, update question config, update titles and descriptions, update allowed respondent emails, and toggle required status.

When the owner creates a survey, the builder state is submitted to `submitSurvey` in `lib/actions/create_survey.ts`. That action inserts the survey first, then inserts sections and questions with order indexes and the generated survey or section identifiers.

When the owner edits an existing survey, the edit route loads the owned survey and hydrates `useSurveyStore` with `setSurvey`. Saving submits the current builder state to `updateSurvey`, which updates the survey row, removes sections and questions no longer present, upserts the remaining section and question rows, revalidates affected routes, and redirects back to the survey list.

Allowed respondent emails are normalized before persistence. During updates the previous allowlist is replaced with the current builder list. An empty list means the published survey remains public; a non-empty list makes the public route and submission action require a signed-in user with a matching email.

### 5.3 Response Form Design

The public response form renders one section at a time. Question-specific input components write answers through response helpers, and required validation blocks forward navigation or final submission when required answers in the current section are missing. Final submission sends an answer form to `submitSurveyResponse`.

### 5.4 Analytics and Export Design

Analytics pages load persisted owner-scoped data through `read_analytics.ts`. Chart helpers transform submissions and answers into grouped datasets. Export pages pass selected options to route handlers, which reuse export utilities:

- `survey_csv.ts` for long and wide CSV response export.
- `chart_report.ts` for JSON chart report content.
- PDF output through the print-ready report page.

## 6. User Interface Design

### 6.1 Navigation Structure

Authenticated pages use the dashboard layout with sidebar navigation to overview, surveys, create survey, analytics, and logout. Public pages use simpler layouts for the homepage and respondent survey flow.

### 6.2 Dashboard UI

The dashboard emphasizes operational survey work:

- Summary metrics for surveys, published surveys, views, and submissions.
- Recent survey list with quick access to edit, share, and view actions.
- Survey list cards with state badges and management controls.
- Analytics list and detail pages for survey performance review.

### 6.3 Survey Builder UI

The survey builder provides:

- Survey title and description controls.
- Section-level title and description controls.
- Question cards with question title, description, type selector, required toggle, and type-specific configuration.
- Toolbar actions for adding sections and questions.
- Save as draft or publish actions.
- Edit mode for updating an existing owned survey.
- Access controls for adding or removing allowed respondent emails.

### 6.4 Respondent UI

The public response UI presents:

- Survey title and description.
- One section at a time.
- Question-specific controls for all supported question types.
- Previous and next navigation.
- Required-answer validation feedback.
- Submission confirmation after success.

### 6.5 Export and Report UI

The export UI lets owners select CSV format and report options. The PDF report UI is print-oriented and uses analytics summary cards and charts suitable for browser printing.

## 7. Assumptions and Dependencies

### 7.1 Assumptions

- Users access the system through modern desktop or mobile browsers.
- Survey datasets remain small to moderate for the current academic project scope.
- Respondents can access public survey links over the network.
- Survey owners have valid Supabase Auth accounts.
- Browser print-to-PDF is acceptable for the current report export implementation.
- Survey templates, branching, team workspaces, and offline response collection are future scope.

### 7.2 Dependencies

| Dependency | Purpose |
| --- | --- |
| Next.js 16 | App Router, server components, route handlers, and application runtime. |
| React 19 | UI rendering and component model. |
| TypeScript | Static typing for application and domain structures. |
| Supabase Auth | User registration, login, logout, sessions, and identity. |
| Supabase Database | Persistent relational data and row-level security. |
| Zustand | Client-side survey builder state. |
| React Hook Form | Form handling where used by auth and input workflows. |
| Recharts | Analytics chart rendering. |
| React QR Code | Survey sharing QR code rendering. |
| Zod | Runtime schemas and typed database row definitions. |
| Vitest | Unit test runner. |
| Playwright | End-to-end browser test runner. |

## 8. Glossary of Terms

| Term | Definition |
| --- | --- |
| Answer | One stored response to one survey question. |
| Analytics | Survey metrics and charts derived from views, submissions, and answers. |
| Archived survey | A survey retained for owner use but not publicly answerable. |
| Dashboard | Authenticated workspace for survey owners. |
| Draft survey | A survey visible to its owner but not publicly answerable. |
| Published survey | A survey available to respondents through its public link. |
| Respondent | A person who completes a published survey. |
| Section | A group of questions inside a survey. |
| Submission | One completed response to a survey. |
| Survey | A questionnaire made of sections and questions. |
| Survey owner | Authenticated user who creates and manages surveys. |
| RLS | Row-level security, Supabase database policies that restrict access by row. |
