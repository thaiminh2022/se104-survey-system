# SE104 Survey System

A survey management system built with Next.js, React, Supabase, and shadcn-style UI components. The app lets authenticated users create surveys, publish or archive them, share public response links, collect submissions, inspect analytics, and export response data or chart reports.

## Table of content

<!-- TOC tocDepth:2..3 chapterDepth:2..6 -->

- [Table of content](#table-of-content)
- [Team Members](#team-members)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Running With Public Supabase](#running-with-public-supabase)
- [Running With Local Supabase](#running-with-local-supabase)
- [Scripts](#scripts)
- [Testing](#testing)
- [Test Coverage Overview](#test-coverage-overview)
- [Project Documentation](#project-documentation)
- [Project Structure](#project-structure)
- [Notes](#notes)

<!-- /TOC -->

## Team Members

| Name              | Role      |
| ----------------- | --------- |
| Ho Quoc Thai      | Developer |
| Chau Van Phong    | Developer |
| Nguyen Hoang Minh | Developer |

## Main Features

- Authentication with Supabase.
- Dashboard for owned surveys and workspace metrics.
- Survey builder for creating and editing surveys with sections, required questions, multiple question types, and optional respondent email allowlists.
- Public survey response pages for published surveys, including restricted surveys that require an allowed signed-in email.
- Analytics pages with submission counts, conversion, and answer charts.
- CSV export for raw responses.
- JSON chart report export and print-to-PDF chart report.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Supabase
- Zustand
- React Hook Form
- Recharts
- Vitest
- Playwright

## Requirements

- Node.js
- pnpm
- Supabase CLI, only if running a local Supabase database

Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create `.env.local` in the project root.

Minimum variables for the app:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not commit real Supabase secrets, service role keys, database passwords, or JWT secrets.

## Running With Public Supabase

Use this mode when connecting to the hosted Supabase project.

1. Put the hosted project URL and publishable key in `.env.local`.
2. Start the app:

```bash
pnpm dev
```

3. Open:

```text
http://localhost:3000
```

This mode uses the remote Supabase database and auth project configured by the environment variables.

## Running With Local Supabase

Use this mode when you want isolated local development data.

1. Install and start Supabase locally:

```bash
supabase start
```

2. Apply the schema from the committed migration:

```bash
supabase db reset
```

3. Copy the local API URL and anon/publishable key printed by Supabase into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local anon or publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Start Next.js:

```bash
pnpm dev
```

If Supabase has not been initialized on your machine yet, run `supabase init` first, then retry `supabase start`.

## Scripts

Run the development server:

```bash
pnpm dev
```

Build production assets:

```bash
pnpm build
```

Start the production server after building:

```bash
pnpm start
```

Run ESLint:

```bash
pnpm lint
```

## Testing

Run unit tests:

```bash
pnpm test:run
```

Run unit tests in watch mode:

```bash
pnpm test
```

Run Playwright E2E tests:

```bash
pnpm test:e2e
```

Run one Playwright browser project:

```bash
pnpm exec playwright test --project=chromium
```

Playwright starts the app in E2E fixture mode on port `3100`. This avoids hitting a real Supabase project during browser tests.

## Test Coverage Overview

- Unit tests cover helper functions, auth actions, create/update survey actions, response submission, survey store editing behavior, publish and response validation, CSV export, chart report generation, chart aggregation, and export route handlers.
- E2E tests cover routing/auth, public response behavior, create and edit survey builder flows, analytics, CSV export, print-to-PDF export, and API route behavior.

## Project Documentation

- [Vision and Scope](docs/vision-and-scope.md)
- [Software Requirements Specification](docs/software-requirements-specification.md)
- [Software Design Document](docs/software-design-document.md)
- [PlantUML Diagrams](docs/diagrams/README.md)
- [Use Cases](docs/use-cases.md)
- [Business Rules](docs/business-rules.md)
- [Test Suite](docs/test-suite.md)

## Project Structure

```text
app/            Next.js App Router pages, layouts, and route handlers
components/     UI and feature components
hooks/          Shared React hooks
lib/            Actions, Supabase clients, stores, exports, charts, and types
supabase/       Database migrations
__tests__/      Vitest unit tests and Playwright E2E tests
public/         Static assets
```

## Notes

- The app uses Next.js 16. Check `node_modules/next/dist/docs/` before changing framework-specific APIs.
- Public response pages only load published surveys.
- Dashboard routes are protected by `proxy.ts`.
- CSV export downloads response rows. PDF export opens a print-ready report page and calls `window.print()`.
