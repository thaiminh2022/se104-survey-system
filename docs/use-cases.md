# SE104 Survey System - Use Cases

## 1. System Context

SE104 Survey System is a web-based survey management application. Authenticated survey owners can create surveys, publish or archive them, share public links, collect responses, view analytics, and export results. Respondents can open published survey links and submit answers without needing an account.

Use case flows follow the ownership, survey state, response, analytics, and export rules defined in [Business Rules](business-rules.md).

## 2. Actors

| Actor | Description |
| --- | --- |
| Visitor | A person who has not signed in. They may view the public homepage, register, log in, or answer published surveys. |
| Respondent | A visitor or signed-in user who opens a published survey and submits a response. |
| Survey Owner | An authenticated user who creates, manages, shares, analyzes, and exports their own surveys. |
| Supabase Auth | External authentication service used for registration, login, logout, and session validation. |
| Supabase Database | External persistence layer for surveys, sections, questions, submissions, answers, counters, and row-level access control. |

## 3. Use Case Summary

| ID | Use Case | Primary Actor | Goal |
| --- | --- | --- | --- |
| UC-01 | Register account | Visitor | Create an account to access the dashboard. |
| UC-02 | Log in | Visitor | Start an authenticated session. |
| UC-03 | Log out | Survey Owner | End the current session. |
| UC-04 | View dashboard | Survey Owner | See workspace-level survey metrics and recent surveys. |
| UC-05 | Create survey | Survey Owner | Build and save a new survey as draft or published. |
| UC-06 | Manage survey status | Survey Owner | Publish a draft survey or archive a published survey. |
| UC-07 | Delete survey | Survey Owner | Remove an owned survey. |
| UC-08 | Share survey | Survey Owner | Copy a public survey link or use a QR code. |
| UC-09 | Submit survey response | Respondent | Complete a published survey. |
| UC-10 | View analytics | Survey Owner | Inspect views, submissions, conversion, timeline, and answer charts. |
| UC-11 | Export response data | Survey Owner | Download raw responses as CSV. |
| UC-12 | Export analytics report | Survey Owner | Download chart-ready JSON or open a print-ready PDF report. |

## 4. Detailed Use Cases

### UC-01: Register Account

| Field | Description |
| --- | --- |
| Primary actor | Visitor |
| Preconditions | Visitor is not authenticated. |
| Trigger | Visitor opens the registration page. |
| Main flow | 1. Visitor enters email, password, and password confirmation. 2. System validates that passwords match. 3. System submits the registration request to Supabase Auth. 4. If a session is created, the system redirects the user to the requested return URL or dashboard. 5. If email confirmation is required, the system redirects to login with a confirmation message. |
| Alternate flows | A1. Password confirmation does not match: system shows an error. A2. Supabase rejects registration: system redirects back with the provider error message. |
| Postconditions | A new account exists or the visitor is told what action is required next. |

### UC-02: Log In

| Field | Description |
| --- | --- |
| Primary actor | Visitor |
| Preconditions | Visitor has an existing account. |
| Trigger | Visitor submits the login form. |
| Main flow | 1. Visitor enters email and password. 2. System authenticates with Supabase Auth. 3. System redirects to the requested return URL or dashboard. |
| Alternate flows | A1. Invalid credentials: system redirects back to login with an error. A2. Invalid return URL: system uses the dashboard as the safe default. |
| Postconditions | Visitor becomes an authenticated Survey Owner. |

### UC-03: Log Out

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated. |
| Trigger | User selects Log out from the dashboard sidebar. |
| Main flow | 1. System signs the user out through Supabase Auth. 2. System redirects to the login page. |
| Postconditions | User session is ended. |

### UC-04: View Dashboard

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated. |
| Trigger | User opens `/dashboard`. |
| Main flow | 1. System validates the session. 2. System loads surveys owned by the user. 3. System displays total surveys, published surveys, views, submissions, and recent surveys. |
| Alternate flows | A1. User is unauthenticated: system redirects to login with a return URL. A2. Survey data cannot be loaded: system shows an error card. |
| Postconditions | User can navigate to survey management, creation, sharing, viewing, or analytics. |

### UC-05: Create Survey

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated. |
| Trigger | User opens the survey builder. |
| Main flow | 1. User edits survey title and description. 2. User adds one or more sections. 3. User adds questions to sections. 4. User selects question types and configures options. 5. User marks questions as required when needed. 6. User saves the survey as a draft or publishes it. 7. System persists the survey, sections, and questions. 8. System redirects to the survey list. |
| Supported question types | Single choice, multiple choice, rating scale, Likert scale, short text, long text, dropdown, yes/no, matrix, ranking, date/time, consent, and number. |
| Alternate flows | A1. User is unauthenticated: system redirects to login. A2. Database insert fails: system returns an error. |
| Postconditions | A new survey exists with state `draft` or `published`. |

### UC-06: Manage Survey Status

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User owns at least one survey. |
| Trigger | User selects the survey status action. |
| Main flow | 1. System asks for confirmation. 2. If the survey is draft, system changes it to published. 3. If the survey is published, system changes it to archived. 4. System refreshes the survey list. |
| Business rules | See [Business Rules](business-rules.md), especially survey state and lifecycle rules. Draft surveys are not publicly answerable, published surveys can be opened by respondents, archived surveys are not publicly answerable, and the current UI does not allow archived surveys to be republished. |
| Alternate flows | A1. User cancels confirmation: no change occurs. A2. Status update fails: system shows an error. |
| Postconditions | Survey state is updated if the operation succeeds. |

### UC-07: Delete Survey

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User owns the survey. |
| Trigger | User chooses Delete from the survey actions menu. |
| Main flow | 1. System asks for confirmation. 2. User confirms deletion. 3. System deletes the owned survey. 4. System refreshes the survey list. |
| Alternate flows | A1. User cancels confirmation: no deletion occurs. A2. Database deletion fails: system returns an error. |
| Postconditions | Survey is removed from the owner's survey list. |

### UC-08: Share Survey

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User owns the survey. |
| Trigger | User opens the Share page for a survey. |
| Main flow | 1. System builds a public URL in the form `/surveys/{id}`. 2. System displays share actions for the link. 3. System displays a QR code containing the same URL. |
| Business rules | See [Business Rules](business-rules.md), especially sharing and public access rules. Sharing a link does not override survey state, and only published surveys are publicly accessible. |
| Postconditions | User can distribute the link or QR code to respondents. |

### UC-09: Submit Survey Response

| Field | Description |
| --- | --- |
| Primary actor | Respondent |
| Preconditions | Survey exists and is published. |
| Trigger | Respondent opens a public survey link. |
| Main flow | 1. System loads the published survey. 2. System increments the survey view count. 3. Respondent answers questions section by section. 4. System prevents navigation or submission when required questions in the current section are unanswered. 5. Respondent submits the final section. 6. System creates a submission and answer rows. 7. System displays a submitted confirmation. |
| Alternate flows | A1. Survey is draft or archived: system denies access. A2. Survey cannot be found: system shows an error. A3. No answers are submitted: system returns an error. |
| Postconditions | Submission and answers are stored. Survey submission count is maintained by database trigger. |

### UC-10: View Analytics

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated and owns the survey. |
| Trigger | User opens analytics pages. |
| Main flow | 1. System lists owned surveys with views, submissions, conversion, and status. 2. User opens a survey analytics detail page. 3. System displays views, submissions, conversion, submissions over time, and answer distributions. |
| Alternate flows | A1. User is unauthenticated: system redirects to login. A2. User does not own the survey: system returns not found or an error. |
| Postconditions | User can evaluate survey performance and responses. |

### UC-11: Export Response Data

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated and owns the survey. |
| Trigger | User submits the CSV export form. |
| Main flow | 1. User chooses long or wide CSV shape. 2. User chooses whether to include submission metadata, question metadata, and empty answers. 3. System validates ownership. 4. System returns a CSV attachment. |
| Alternate flows | A1. User is unauthenticated: system returns 401. A2. Survey is not found or not owned: system returns 404. |
| Postconditions | User receives a CSV file containing survey responses. |

### UC-12: Export Analytics Report

| Field | Description |
| --- | --- |
| Primary actor | Survey Owner |
| Preconditions | User is authenticated and owns the survey. |
| Trigger | User submits the analytics report export form. |
| Main flow | 1. User chooses report content: summary, submission timeline, and/or answer distributions. 2. User chooses JSON or PDF. 3. For JSON, system returns a chart report file. 4. For PDF, system redirects to a print-ready report page. |
| Alternate flows | A1. User is unauthenticated: system returns 401. A2. Survey is not found or not owned: system returns 404. |
| Postconditions | User receives a report or opens a printable report page. |

## 5. Out-of-Scope or Limited Use Cases

| Use Case | Current status |
| --- | --- |
| Edit an existing survey after creation | Route exists, but the edit UI is currently a placeholder. |
| Republish archived survey | Current status flow does not allow archived surveys to return to published. |
| Team collaboration | No team, role, or organization model is implemented. |
| Survey templates | No template management is implemented. |
| Conditional branching | Section end behavior types exist in the schema, but the active builder and respondent flow use linear section navigation. |
