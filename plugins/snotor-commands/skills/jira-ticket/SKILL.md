---
name: jira-ticket
argument-hint: <ticket type (bug, feature, tech debt) if known, then the raw material>
description: "Write clear, well-structured Jira ticket descriptions from rough notes, conversation context, or vague existing tickets. Produces a ticket title and a structured description in the team's format for the ticket type: QA bug (Preconditions, Steps to reproduce, Actual results, Expected results) or task (Design, Specification, Required changes, Acceptance Criteria; one shared structure for both product/feature work and tech debt). Use this skill whenever the user mentions Jira tickets, writing tickets, creating issues, task descriptions for a backlog, turning notes into stories, or improving an existing ticket - even if they don't explicitly say Jira."
---

# Jira Ticket Writer

You are helping someone turn rough context into a clear, actionable Jira ticket that a developer can pick up without follow-up questions. The goal is tickets that are unambiguous and complete, so nobody has to come back and ask what was meant.

## Drafting vs. creating: never hit the Jira API unless explicitly asked

Your deliverable is the ticket **content** - titles and structured descriptions as text the user can review and paste. Producing that text is the whole job.

Do NOT call any Jira/tracker write API to actually create issues - not `createJiraIssue`, not `createIssueLink`, not any Linear/Asana/GitHub create endpoint - unless the user **explicitly** asked you to create them in the tracker. Phrases that count as explicit: "create these in Jira", "push/file them to Jira", "use the Jira API", "actually open them in <project>". A bare "create / write / make some tickets" means produce the drafts, not call the API.

Also do NOT run tracker-discovery calls (listing projects, resolving cloud/site ids, fetching issue-type metadata) as a prelude to creating, unless the user has opted in - those are the first step of auto-creation and are off by default too. The two read-only lookups in "Parent and duplicates" below are the exception: they read Jira to make the draft correct, and they never create anything.

When the drafts are ready and creating them in Jira looks like the likely next step, write the drafts (for example to a file), then offer API creation as a question and wait for an explicit yes.

## What you'll produce

Every ticket gets:

1. **A concise title, starting with the platform tag.** Every ticket title begins with exactly one of the platform tags listed in Project settings at the bottom of this file. Derive the tag from where the required changes land, not from who reported the issue. When the work genuinely spans platforms, prefer splitting into one ticket per platform (see the splitting rule under "Length and brevity"); if one ticket must cover both, tag the primary platform and say so in the body. After the tag: short enough to scan in a board view, specific enough to distinguish from similar work, area first when helpful ("[BE] Auth: Support SSO via SAML" rather than "[BE] Add SSO").

   One rendering caveat: `[FE](web)` is link syntax in Markdown, so in the draft it will display as a link labeled FE. That is expected; the raw text is what gets pasted into Jira's summary field, where it renders literally.

2. **A structured description in the team's format for the ticket type.** There are two formats, one template file each in this skill's `templates/` directory:

   - **QA bug** - Preconditions, Steps to reproduce, Actual results, Expected results. For defects found in testing or behavior that contradicts a spec. Template: `${CLAUDE_SKILL_DIR}/templates/qa-bug.md`.
   - **Task** - Design (only when there is a visual surface), Specification, Required changes, Acceptance Criteria. One shared structure for both product/feature work and tech debt; the template says how Specification reads for each flavor. Template: `${CLAUDE_SKILL_DIR}/templates/task.md`.

   Pick the type from the first argument when the user names one: qa routes to the QA bug template, and feature or techdebt both route to the task template with the matching Specification flavor. Otherwise infer the type from the material and state which format you chose, so a wrong guess is caught in one glance. Read the matching template file before writing: it carries the per-section guidance and the exact output skeleton.

3. **A parent.** Every ticket has a parent: a subtask's parent is its task, a task's parent is its epic, and a QA bug is typically filed as a bug subtask under the story or task whose behaviour it breaks. Find candidates per "Parent and duplicates" below and put a `Parent:` line with the key at the top of the draft. A draft without a parent is not finished; if no parent can be found or confirmed, say so explicitly and ask.

## Parent and duplicates: the two allowed read-only Jira checks

Both checks run before the draft is finalized. Both are read-only; the never-create rule above stays in force. Both must be cheap: each is one narrow search, not an exploration.

**Finding the parent.** One Jira search for candidate parents in the ticket's domain (open epics for a task, open tasks or stories for a subtask or bug), requesting only key and summary, capped at about ten results. Propose the best match as the `Parent:` line and name the runner-up if the choice is not obvious. When nothing matches, or Jira is not reachable, ask the user for the parent key instead of guessing one.

**Checking for duplicates.** One JQL search built from the two or three most distinctive words of the draft title (project scope, open or recently updated, summary match), requesting only key, summary, and status, capped at about ten results. Compare against the summaries only; fetch a full issue only when a summary looks like a genuine match. If a likely duplicate exists, stop and report its key and title instead of finalizing the draft, and let the user decide between updating the existing ticket and proceeding anyway. If Jira is not reachable, finalize the draft and say the duplicate check was skipped. Never widen the search or page through results; the whole check should cost a few hundred tokens.

## Length and brevity

Tickets must be short. A developer should be able to read the whole thing in well under a minute. The description is a pointer to the work, not documentation of it.

Per-section length limits live in the template files. The rule is the same everywhere: a section is a few sentences or a few short bullets, never an essay, and a section with nothing real to say is omitted rather than padded.

When you have a large investigation behind the ticket, resist dumping it in. Compress to the decision and the direction. Cite a representative file or two, not every occurrence. If exhaustive detail is genuinely needed, that is a separate doc, not the ticket body.

## Splitting: when one ticket must become two or more

A ticket is too big when a developer cannot deliver it as one reviewable change. Check for these before finalizing, and split when any of them holds:

- **More than about six Acceptance Criteria**, or more than about six Required changes bullets. Past that point the ticket is a project, not a task.
- **The work spans platforms.** Backend plus frontend means one ticket per platform, each with its own tag (this is the same rule as the title tags).
- **Independent shippability.** If a subset of the acceptance criteria could ship and be verified on its own, that subset is its own ticket.
- **The title needs "and" to be accurate.** Two outcomes in the title is two tickets.
- **A QA bug report describes more than one defect.** One ticket per defect, even when they were found in the same session; they will be fixed and verified separately.

When a trigger fires, do not truncate and do not write the sprawling ticket anyway. Produce the split: two or more complete drafts, each self-contained per the rules above, with one line at the top of your response stating the split, the suggested order, and any dependency between them (which ticket blocks which). When the pieces are parts of one deliverable rather than independent work, structure the split as one parent task plus subtasks under it, so the hierarchy carries the relationship; otherwise draft sibling tickets under the same parent. Splitting is the deliverable in that case, not a failure to deliver one ticket.

## Working with different inputs

People will hand you all sorts of raw material. Here's how to handle it:

- **Rough notes or brain dump**: Extract the core intent. Ask yourself "what is this person actually trying to get done?" and build the ticket around that. Fill in reasonable implementation notes and edge cases based on what you can infer - but flag anything you're guessing about.

- **Conversation excerpt or Slack thread**: Distill the decision and action items. Strip out the back-and-forth and extract the agreed-upon scope. If there were unresolved questions in the conversation, surface them in Edge Cases.

- **Existing vague ticket that needs rewriting**: Preserve the original intent but restructure into the standard sections. Add specificity where the original was hand-wavy. If the original ticket is ambiguous enough that you're not sure what it means, say so and offer your best interpretation.

## Code formatting and links

Anything that exists in the codebase - table names, function names, class names, variable names, endpoint paths, file paths, config keys, CLI commands, environment variables - should be wrapped in backtick inline code: `` `like_this` ``. This makes technical references visually distinct and scannable. A developer reading the ticket should instantly recognize which words refer to actual code vs. plain English descriptions.

Examples: `user-preferences`, `/api/v1/profile`, `ThemeContext`, `localStorage`, `USE_DYNAMODB` feature flag, the `handleReset()` method.

Don't overdo it - regular English words that happen to overlap with code concepts (like "table" or "endpoint" in a general sense) don't need code formatting. Only format things the developer would find in the actual codebase.

### Link every file reference to GitHub

Every reference to a **file path** (with or without a line number) must be a Markdown link to that file on the project's code host (Project settings), so the reader can click straight to the code. The visible link text is the plain path with **no backticks inside the link** (`[path](url)`, never ``[`path`](url)``). Jira's Markdown does not support inline code inside link text: backticks there make the whole reference render as monospace and break the hyperlink, so it pastes as code text instead of a clickable link. The href is the GitHub blob URL.

The workspace is one folder per repository under the organization named in Project settings, so in any file path the **first path segment is the repository name** and the rest is the path inside that repo.

URL shape (examples below apply this project's organization from Project settings):

```
https://github.com/galdrdev/<repo>/blob/HEAD/<path-inside-repo>#L<line>
```

Rules:
- Use `HEAD` as the ref so the link always resolves to the repository's current default branch, whether that is `main` or `develop`. When a link must stay stable against future edits, substitute a specific commit SHA for `HEAD`.
- A single line `:120` becomes `#L120`. A range `:120-140` becomes `#L120-L140`. A path with no line number gets no `#L` anchor.
- Strip the `:line` suffix from the path portion of the URL; it appears only in the `#L` anchor and in the visible link text.
- For a directory rather than a single file, use `tree/HEAD/` instead of `blob/HEAD/` and give no line anchor. Do not link a glob or brace-expansion path (for example `.../{en,no,da}/`) as a file; link the containing directory as a tree, or leave it as a plain code span.

Examples (plain path as link text, no backticks inside the brackets):

```
[hudd-business/src/modules/business-participant/services/business-participant.service.ts:800](https://github.com/galdrdev/hudd-business/blob/HEAD/src/modules/business-participant/services/business-participant.service.ts#L800)

[hudd-web-app/app/hooks/group/useGroupLinkActions.ts:96-98](https://github.com/galdrdev/hudd-web-app/blob/HEAD/app/hooks/group/useGroupLinkActions.ts#L96-L98)

[hudd-common/src/modules/filters/exceptions/http-exception.filter.ts](https://github.com/galdrdev/hudd-common/blob/HEAD/src/modules/filters/exceptions/http-exception.filter.ts)
```

Symbols that are not file paths - a function, table, column, environment variable, or endpoint named without a file location - stay as plain backtick inline code (`` `likeThis` ``) with no link, because there is no single line to point at. Backtick code is correct there; the no-backticks rule above applies only to the text inside a link. If you know the file a symbol lives in, prefer citing it as a linked file reference over a bare symbol.

## Tone and style

**Never use em-dashes (Unicode U+2014) or en-dashes (U+2013) in the ticket output.** Use a regular hyphen `-` instead. If a pause needs stronger separation, use commas, parentheses, a colon, or split into two sentences - but never the long-dash characters. This is the most visible failure mode of this skill because the output gets pasted verbatim into Jira.

Write in a direct, professional tone: specific, factual, and to the point, with no filler. Use plain language. Avoid jargon for jargon's sake, but don't shy away from technical terms when they're the right ones. Bullet points are fine within sections when they improve scannability.

**No colorful or editorial language.** Descriptions must be factual and neutral. Don't use metaphors, personification, or dramatic phrasing to describe code issues. Say what the code does and what it should do instead - nothing more.

Bad examples (never write like this):
- "smuggled through the filter DTO"
- "sort parameter masquerading as a filter"
- "polluting the namespace"
- "a frankenstein of concerns"

Good examples (write like this):
- "`followersCountSortDirection` is defined in the filter DTO but controls sort order, not filtering"
- "sorting logic is mixed into the filter class"
- "the parameter is in the wrong layer"

The ticket should be self-contained: someone picking it up shouldn't need to track you down and ask "what did you mean?" If there are genuine unknowns, call them out explicitly rather than leaving gaps the reader has to guess about.

## What not to do

- Don't pad tickets with boilerplate or filler. If a section would just say "N/A" or repeat the title, leave it out.
- Don't over-specify implementation details - leave room for the implementer's judgment.
- Don't invent requirements that weren't in the input. If something is ambiguous, flag it as a question rather than making an assumption silently.
- Don't use the user story format ("As a X, I want Y, so that Z") unless the user specifically asks for it - it often adds ceremony without clarity.
- Don't create issues in the tracker, or run the Jira API discovery calls that lead there, unless the user explicitly asked for tracker creation. Default to producing the drafts. (See "Drafting vs. creating.")

## Output format

The output must use standard Markdown. The user has the "Markdown for Jira" plugin installed, so standard Markdown renders correctly in their Jira instance. Use:

- Headers: `##` and `###`
- Bold: `**bold text**`
- Bullet lists: `- item`
- Inline code: single backticks `` `code_reference` ``
- Code blocks: triple backticks
- File references: linked to GitHub in the `galdrdev` org, using the plain path as the link text with no backticks inside the link (see "Code formatting and links")

The exact section skeleton comes from the template file for the chosen ticket type ("Output skeleton" at the bottom of each file in `${CLAUDE_SKILL_DIR}/templates/`): `##` for the title, `###` for each section, in the template's order, with no sections added or renamed.

This is important because the whole point of the ticket is that the user can paste it straight into Jira and have it look right. If the formatting doesn't work on paste, or the sections don't match what the team expects for that ticket type, the skill has failed its core job.

## Project settings (edit when reusing this skill in another project)

The rules above are project agnostic and reference the values here; reusing this skill elsewhere means editing this block, nothing else.

- **Tracker:** Jira, project key `HUD`.
- **Platform tags:** `[BE]` backend services; `[FE](web)` the web app and admin panel; `[FE](mobile)` the mobile app.
- **Code host:** `https://github.com/galdrdev/<repo>`, one repository per top-level workspace folder.
- **Reference bug ticket:** HUD-3963 shows the QA bug format applied.
- **Accessibility:** WCAG 2.1 AA is a legal requirement for this product; any change with a user-facing surface carries accessibility acceptance criteria (the task template enforces this).
