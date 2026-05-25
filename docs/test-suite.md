# SE104 Survey System - Test Suite

| ID | Test Level | Test File | Feature Area | Test Coverage | Command |
| --- | --- | --- | --- | --- | --- |
| TS-01 | Unit | `__tests__/unit/actions/auth.test.ts` | Authentication actions | Login success/error redirects, registration validation, email-confirmation redirect, logout-and-return account switching. | `pnpm test:run` |
| TS-02 | Unit | `__tests__/unit/actions/create_survey.test.ts` | Survey create/edit actions | Survey insert flow, section/question persistence, edit updates, removed row cleanup, publish validation, allowed respondent email replacement. | `pnpm test:run` |
| TS-03 | Unit | `__tests__/unit/actions/submit_survey_response.test.ts` | Survey response submission | Empty answer rejection, anonymous submissions, authenticated user submissions, database insert errors, restricted survey access rejection. | `pnpm test:run` |
| TS-04 | Unit | `__tests__/unit/components/login-form.test.tsx` | Login UI | Login form field rendering and error display. | `pnpm test:run` |
| TS-05 | Unit | `__tests__/unit/components/register-form.test.tsx` | Registration UI | Registration field rendering and error display. | `pnpm test:run` |
| TS-06 | Unit | `__tests__/unit/routes/export_routes.test.ts` | Analytics export routes | CSV unauthorized handling, owner CSV attachment, PDF redirect, JSON chart report attachment. | `pnpm test:run` |
| TS-07 | Unit | `__tests__/unit/helper.test.ts` | Helper utilities | Question type display names, site URL resolution, deployment URL fallback, Supabase environment detection. | `pnpm test:run` |
| TS-08 | Unit | `__tests__/unit/survey_store.test.ts` | Survey builder store | Default draft state, section/question add/delete, field updates, edit hydration, reset, drag reorder behavior, option reorder behavior. | `pnpm test:run` |
| TS-09 | Unit | `__tests__/unit/survey_publish_validation.test.ts` | Publish validation | Valid survey acceptance, blank title rejection, empty section rejection, empty option rejection, ranking option minimum. | `pnpm test:run` |
| TS-10 | Unit | `__tests__/unit/survey_response_validation.test.ts` | Response validation | Missing required answer rejection, number bounds, integer-only answers, valid ranges, invalid range rejection. | `pnpm test:run` |
| TS-11 | Unit | `__tests__/unit/survey_csv.test.ts` | CSV export | Long-form rows, wide-form rows, escaped cells, empty answer output, stable filenames. | `pnpm test:run` |
| TS-12 | Unit | `__tests__/unit/chart_report.test.ts` | Chart report export | Summary metrics, timelines, answer distributions, disabled report sections, zero-view conversion, stable filenames. | `pnpm test:run` |
| TS-13 | Unit | `__tests__/unit/question_answer_charts.test.ts` | Answer chart aggregation | Chartable value counting, matrix row labeling, text answer sample handling. | `pnpm test:run` |
| TS-14 | E2E | `__tests__/e2e/auth-routing.spec.ts` | Authentication routing | Home auth links, dashboard login redirects with return URL, public survey route accessibility, login/register browser flows. | `pnpm test:e2e` |
| TS-15 | E2E | `__tests__/e2e/survey-builder.spec.ts` | Survey builder and management | Create survey draft, allowed respondent email UI, add section, required question toggle, publish confirmation, edit existing survey. | `pnpm test:e2e` |
| TS-16 | E2E | `__tests__/e2e/public-response.spec.ts` | Public response flow | Required-answer navigation gate, successful submit, multi-section back navigation preserving valid answers. | `pnpm test:e2e` |
| TS-17 | E2E | `__tests__/e2e/analytics-export.spec.ts` | Analytics and exports | Analytics metrics/charts, CSV download, print-to-PDF report flow. | `pnpm test:e2e` |
| TS-18 | E2E | `__tests__/e2e/api-routes.spec.ts` | API route access | CSV export route login redirect and authenticated CSV response. | `pnpm test:e2e` |

