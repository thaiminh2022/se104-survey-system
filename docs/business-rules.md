# SE104 Survey System - Business Rules

## 1. Purpose

This document defines the business rules that govern SE104 Survey System behavior. These rules clarify who can perform each action, how survey states work, how responses are accepted, and how analytics and exports are protected.

## 2. Actors and Ownership

| ID | Rule |
| --- | --- |
| BR-ACTOR-01 | A visitor may register, log in, view the public homepage, and open published survey links. |
| BR-ACTOR-02 | A respondent may submit answers to an unrestricted published survey without signing in, or to a restricted published survey after signing in with an allowed email. |
| BR-ACTOR-03 | A survey owner is an authenticated user who creates and manages surveys under their own account. |
| BR-ACTOR-04 | Each survey belongs to exactly one survey owner through its `user_id`. |
| BR-ACTOR-05 | A survey owner may only manage, analyze, and export surveys they own. |
| BR-ACTOR-06 | The system must not expose another owner's survey management data, submissions, answers, analytics, or exports. |

## 3. Authentication and Access

| ID | Rule |
| --- | --- |
| BR-AUTH-01 | Dashboard routes require an authenticated session. |
| BR-AUTH-02 | Unauthenticated users who open dashboard routes are redirected to login with a return URL. |
| BR-AUTH-03 | Return URLs must be sanitized so authentication redirects cannot send users to unsafe external destinations. |
| BR-AUTH-04 | Registration requires email, password, and password confirmation. |
| BR-AUTH-05 | Registration must fail when password and password confirmation do not match. |
| BR-AUTH-06 | Email confirmation behavior depends on the Supabase project configuration. |
| BR-AUTH-07 | Logout must end the user's authenticated session before redirecting away from the dashboard. |

## 4. Survey Structure

| ID | Rule |
| --- | --- |
| BR-SURVEY-01 | A survey must have a title. |
| BR-SURVEY-02 | A survey may have a description. |
| BR-SURVEY-03 | A survey must contain at least one section. |
| BR-SURVEY-04 | A section contains zero or more questions during editing, but a useful published survey should contain at least one question. |
| BR-SURVEY-05 | Questions must belong to a section, and sections must belong to a survey. |
| BR-SURVEY-06 | Questions may be marked as required. |
| BR-SURVEY-07 | Question configuration must match the selected question type. |
| BR-SURVEY-08 | Supported question types are single choice, multiple choice, rating scale, Likert scale, short text, long text, dropdown, yes/no, matrix, ranking, date/time, consent, and number. |
| BR-SURVEY-09 | A survey owner may edit the title, description, sections, questions, ordering, required flags, and question configuration of an owned survey. |
| BR-SURVEY-10 | Editing a survey must preserve ownership and must not create sections or questions for a survey owned by another user. |

## 5. Survey State and Lifecycle

| ID | Rule |
| --- | --- |
| BR-STATE-01 | A survey may be in `draft`, `published`, or `archived` state. |
| BR-STATE-02 | Draft surveys are visible to their owner but are not publicly answerable. |
| BR-STATE-03 | Published surveys are publicly accessible through their public survey URL. |
| BR-STATE-04 | Archived surveys remain available to their owner for management and analytics, but are not publicly answerable. |
| BR-STATE-05 | Creating a survey may save it as draft or publish it immediately. |
| BR-STATE-06 | The current survey list action allows draft surveys to become published. |
| BR-STATE-07 | The current survey list action allows published surveys to become archived. |
| BR-STATE-08 | The current UI does not allow archived surveys to be republished. |
| BR-STATE-09 | Sharing a survey link or QR code does not override the survey state. |
| BR-STATE-10 | Archived surveys must not display an action that implies they can be republished through the current UI. |

## 6. Sharing and Public Access

| ID | Rule |
| --- | --- |
| BR-SHARE-01 | A public survey URL is built from the configured site URL and survey id. |
| BR-SHARE-02 | Owners may view and distribute a public link or QR code for an owned survey. |
| BR-SHARE-03 | Public survey pages must only load surveys in `published` state. |
| BR-SHARE-04 | Opening a draft, archived, missing, or unauthorized survey through a public route must not expose answerable survey content. |
| BR-SHARE-05 | Public access to a survey does not grant access to dashboard, analytics, or export pages. |
| BR-SHARE-06 | A survey with no allowed respondent emails is public to anyone with the published link. |
| BR-SHARE-07 | A survey with one or more allowed respondent emails is restricted and requires the respondent to sign in with a matching normalized email address. |
| BR-SHARE-08 | Allowed respondent emails must be stored in lowercase trimmed form and must be unique per survey. |
| BR-SHARE-09 | A signed-in respondent who is not allowed for a restricted survey must be offered a way to change accounts. |

## 7. Response Collection

| ID | Rule |
| --- | --- |
| BR-RESP-01 | Respondents may answer unrestricted published surveys without an account. |
| BR-RESP-02 | Authenticated respondents may submit responses to published surveys when the survey is unrestricted or their email is allowed. |
| BR-RESP-03 | The respondent flow presents survey sections one at a time. |
| BR-RESP-04 | Required questions in the current section must be answered before the respondent can proceed or submit. |
| BR-RESP-05 | A completed response creates one submission record for the survey. |
| BR-RESP-06 | Each submitted answer is stored as an answer record associated with the submission and question. |
| BR-RESP-07 | Anonymous submissions store a null user id. |
| BR-RESP-08 | Authenticated submissions may store the respondent user id. |
| BR-RESP-09 | Empty answer payloads must not be accepted as valid submissions. |
| BR-RESP-10 | The survey submission count is maintained by the database trigger after submission changes. |
| BR-RESP-11 | Response submission must re-check survey state and respondent allowlist access on the server before inserting submission or answer rows. |

## 8. Analytics and Reporting

| ID | Rule |
| --- | --- |
| BR-ANALYTICS-01 | Survey owners may view analytics only for surveys they own. |
| BR-ANALYTICS-02 | Survey analytics include views, submissions, conversion, survey state, submission timeline, and answer distributions where chartable. |
| BR-ANALYTICS-03 | Conversion is calculated as submissions divided by views when view count is greater than zero. |
| BR-ANALYTICS-04 | If view count is zero, conversion should display as zero rather than causing a division error. |
| BR-ANALYTICS-05 | Analytics pages must not expose surveys, submissions, or answers owned by another user. |
| BR-ANALYTICS-06 | Charts are generated from persisted submissions and answers, not from client-only state. |

## 9. Export

| ID | Rule |
| --- | --- |
| BR-EXPORT-01 | Export requests require authentication. |
| BR-EXPORT-02 | A survey owner may export only surveys they own. |
| BR-EXPORT-03 | Export requests for unauthenticated users must return unauthorized behavior. |
| BR-EXPORT-04 | Export requests for missing or unowned surveys must return not-found behavior rather than exposing ownership details. |
| BR-EXPORT-05 | CSV export may use long format with one row per answer or wide format with one row per submission. |
| BR-EXPORT-06 | CSV export options may include submission metadata, question metadata, and empty answers. |
| BR-EXPORT-07 | JSON report export may include summary metrics, submission timeline, and answer distributions. |
| BR-EXPORT-08 | PDF export is produced through a print-ready report page and browser printing. |

## 10. Data Protection and Integrity

| ID | Rule |
| --- | --- |
| BR-DATA-01 | Application code must enforce owner filters for dashboard reads, mutations, analytics, and exports. |
| BR-DATA-02 | Supabase row-level security must provide database-level protection for survey, section, question, submission, and answer data. |
| BR-DATA-03 | Survey deletion must be confirmed by the owner before removal. |
| BR-DATA-04 | Deleting a survey removes its dependent sections, questions, submissions, and answers through database relationships. |
| BR-DATA-05 | Persisted view and submission counts must not become negative. |
| BR-DATA-06 | Real Supabase secrets, service role keys, database passwords, and JWT secrets must not be committed to the repository. |

## 11. Current Product Constraints

| ID | Rule |
| --- | --- |
| BR-LIMIT-01 | Team workspaces, organization roles, and collaboration permissions are outside the current implemented scope. |
| BR-LIMIT-02 | Survey templates are outside the current implemented scope. |
| BR-LIMIT-03 | Conditional branching is outside the current implemented respondent flow. |
| BR-LIMIT-04 | Offline response collection is outside the current implemented scope. |
| BR-LIMIT-05 | Native server-side PDF file generation is outside the current implemented scope. |
