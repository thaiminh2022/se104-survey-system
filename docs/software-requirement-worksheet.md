# Software Requirement Worksheet

| ID | Category | Requirement | Priority | Source |
|---|---|---|---|---|
| FR-01 | Authentication | The system shall allow visitors to register with email, password, and password confirmation. | Must | SRS |
| FR-02 | Authentication | The system shall reject registration when password and password confirmation do not match. | Must | SRS |
| FR-03 | Authentication | The system shall allow registered users to log in with email and password. | Must | SRS |
| FR-04 | Authentication | The system shall allow authenticated users to log out. | Must | SRS |
| FR-05 | Authentication | The system shall redirect unauthenticated users from dashboard routes to the login page. | Must | SRS |
| FR-06 | Authentication | The system shall sanitize return URLs before redirecting users after login. | Must | SRS |
| FR-07 | Dashboard | The system shall show total surveys owned by the authenticated user. | Must | SRS |
| FR-08 | Dashboard | The system shall show the number of published surveys owned by the user. | Must | SRS |
| FR-09 | Dashboard | The system shall show total survey views and submissions across owned surveys. | Must | SRS |
| FR-10 | Dashboard | The system shall show recent surveys for quick access. | Should | SRS |
| FR-11 | Dashboard | The system shall provide navigation to dashboard overview, surveys, survey creation, and analytics. | Must | SRS |
| FR-12 | Survey Creation | The system shall allow authenticated users to create surveys with title and description. | Must | SRS |
| FR-13 | Survey Creation | The system shall allow a survey to contain one or more sections. | Must | SRS |
| FR-14 | Survey Creation | The system shall allow sections to contain questions. | Must | SRS |
| FR-15 | Survey Creation | The system shall allow users to add and remove sections while keeping at least one section. | Should | SRS |
| FR-16 | Survey Creation | The system shall allow users to add and remove questions. | Must | SRS |
| FR-17 | Survey Creation | The system shall allow users to configure question title, description, type, required flag, and type-specific settings. | Must | SRS |
| FR-18 | Survey Creation | The system shall support single choice, multiple choice, rating scale, Likert scale, short text, long text, dropdown, yes/no, matrix, ranking, date/time, consent, and number questions. | Must | SRS |
| FR-19 | Survey Creation | The system shall allow a survey to be saved as draft. | Must | SRS |
| FR-20 | Survey Creation | The system shall allow a survey to be published during creation. | Must | SRS |
| FR-21 | Survey Creation | The system shall persist surveys, sections, and questions in the database. | Must | SRS |
| FR-22 | Survey Management | The system shall list surveys owned by the authenticated user. | Must | SRS |
| FR-23 | Survey Management | The system shall display each survey title, description, state, and creation date. | Must | SRS |
| FR-24 | Survey Management | The system shall allow owners to publish draft surveys. | Must | SRS |
| FR-25 | Survey Management | The system shall allow owners to archive published surveys. | Must | SRS |
| FR-26 | Survey Management | The system shall prevent archived surveys from being publicly answered. | Must | SRS |
| FR-27 | Survey Management | The system shall allow owners to delete their own surveys after confirmation. | Must | SRS |
| FR-28 | Survey Management | The system shall allow owners to edit existing surveys after creation. | Must | SRS |
| FR-29 | Sharing | The system shall generate a public survey URL using the configured site URL and survey ID. | Must | SRS |
| FR-30 | Sharing | The system shall display share actions for the public survey link. | Must | SRS |
| FR-31 | Sharing | The system shall display a QR code for the public survey URL. | Should | SRS |
| FR-32 | Sharing | The system shall not make draft or archived surveys answerable merely because a link exists. | Must | SRS |
| FR-33 | Survey Response | The system shall allow respondents to open published surveys without signing in. | Must | SRS |
| FR-34 | Survey Response | The system shall reject public access to draft and archived surveys. | Must | SRS |
| FR-35 | Survey Response | The system shall present survey sections one at a time. | Must | SRS |
| FR-36 | Survey Response | The system shall allow respondents to navigate backward and forward between sections. | Should | SRS |
| FR-37 | Survey Response | The system shall prevent proceeding or submitting when required questions are unanswered. | Must | SRS |
| FR-38 | Survey Response | The system shall store one submission for each completed response. | Must | SRS |
| FR-39 | Survey Response | The system shall store answer records associated with the submission and questions. | Must | SRS |
| FR-40 | Survey Response | The system shall allow anonymous submissions with null user ID. | Must | SRS |
| FR-41 | Survey Response | The system shall associate a submission with a user ID when the respondent is authenticated. | Should | SRS |
| FR-42 | Survey Response | The system shall show a success message after survey submission. | Must | SRS |
| FR-43 | Analytics | The system shall show survey-level views, submissions, conversion, and state. | Must | SRS |
| FR-44 | Analytics | The system shall calculate conversion as submissions divided by views, using zero when views are zero. | Must | SRS |
| FR-45 | Analytics | The system shall show submission counts over time. | Should | SRS |
| FR-46 | Analytics | The system shall show answer distributions for chartable questions. | Should | SRS |
| FR-47 | Analytics | The system shall only show analytics for surveys owned by the authenticated user. | Must | SRS |
| FR-48 | Export | The system shall export raw survey response data as CSV. | Must | SRS |
| FR-49 | Export | The system shall support long CSV format with one row per answer. | Must | SRS |
| FR-50 | Export | The system shall support wide CSV format with one row per submission. | Should | SRS |
| FR-51 | Export | The system shall allow CSV options for submission metadata, question metadata, and empty answers. | Should | SRS |
| FR-52 | Export | The system shall export analytics report data as JSON. | Must | SRS |
| FR-53 | Export | The system shall support report options for summary metrics, submission timeline, and answer distributions. | Should | SRS |
| FR-54 | Export | The system shall redirect PDF report requests to a print-ready report page. | Should | SRS |
| FR-55 | Export | The system shall return unauthorized behavior for unauthenticated export requests. | Must | SRS |
| FR-56 | Export | The system shall return not-found behavior when a user requests export for a survey they do not own. | Must | SRS |
| NFR-01 | Security | The system shall protect dashboard pages from unauthenticated access. | Must | SRS |
| NFR-02 | Security | The system shall enforce survey ownership for management, analytics, and exports. | Must | SRS |
| NFR-03 | Security | The system shall rely on Supabase row-level security for database-level access control. | Must | SRS |
| NFR-04 | Security | The repository shall not commit real Supabase secrets, service role keys, database passwords, or JWT secrets. | Must | SRS |
| NFR-05 | Usability | The system shall provide a responsive UI for desktop and mobile browser widths. | Should | SRS |
| NFR-06 | Usability | The system shall clearly indicate validation errors and blocked required-question navigation. | Should | SRS |
| NFR-07 | Reliability | The system shall keep persisted submission counts non-negative. | Must | SRS |
| NFR-08 | Reliability | The system shall handle failed database operations with user-visible or route-level errors. | Must | SRS |
| NFR-09 | Maintainability | The codebase shall use TypeScript types for survey, section, question, submission, answer, chart, and export shapes. | Must | SRS |
| NFR-10 | Maintainability | The codebase shall organize actions, Supabase clients, stores, exports, charts, and types into clear modules. | Should | SRS |
| NFR-11 | Testing | Unit tests should cover helpers, auth actions, create/update survey actions, response submission, survey store behavior, publish and response validation, exports, chart aggregation, and route handlers. | Should | SRS |
| NFR-12 | Testing | End-to-end tests should cover auth routing, public responses, create and edit survey builder flows, analytics, exports, and API routes. | Should | SRS |
| NFR-13 | Portability | The system shall run in environments that support Node.js, pnpm, and Next.js. | Must | SRS |
| NFR-14 | Portability | The system shall support hosted Supabase or local Supabase development when configured. | Should | SRS |
