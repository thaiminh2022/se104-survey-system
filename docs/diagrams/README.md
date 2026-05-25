# PlantUML Diagrams

This folder contains PlantUML source files for SE104 Survey System diagrams, organized by UML diagram type.

## Diagram Set

The set is intentionally limited to diagrams that add distinct design value:

- Class diagram for the domain and persistence structure.
- Sequence diagrams for major request/response interactions.
- State diagram for the survey lifecycle.
- Activity diagram for the end-to-end survey workflow.

| File | Diagram |
| --- | --- |
| `structural/class-diagram.puml` | Core domain, persistence, and survey builder class diagram. |
| `sequence/login-sequence.puml` | Login and protected dashboard access sequence diagram. |
| `sequence/create-survey-sequence.puml` | Survey builder and persistence sequence diagram. |
| `sequence/edit-survey-sequence.puml` | Existing survey edit and update persistence sequence diagram. |
| `sequence/submit-survey-sequence.puml` | Public survey submission sequence diagram. |
| `state/survey-state-diagram.puml` | Survey lifecycle state diagram. |
| `activity/survey-lifecycle-activity.puml` | End-to-end survey lifecycle activity diagram. |

Render with PlantUML or a Markdown/IDE PlantUML extension.
