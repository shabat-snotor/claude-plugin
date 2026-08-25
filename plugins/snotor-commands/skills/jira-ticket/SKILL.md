---
name: jira-ticket
argument-hint: <ticket type (bug, feature, tech debt) if known, then the raw material>
description: "Write clear, well-structured Jira ticket descriptions from rough notes, conversation context, or vague existing tickets. Produces a ticket title and a structured description in the team's format for the ticket type: QA bug (Preconditions, Steps to reproduce, Actual results, Expected results) or task (Design, an unheaded specification, Required changes, Acceptance Criteria; one shared structure for both product/feature work and tech debt). Use this skill whenever the user mentions Jira tickets, writing tickets, creating issues, task descriptions for a backlog, turning notes into stories, or improving an existing ticket - even if they don't explicitly say Jira."
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

1. **A concise title, starting with the platform tag.** Every ticket title begins with exactly one of the platform tags listed in Project settings at the bottom of this file. Derive the tag from where the required changes land, not from who reported the issue. When the work genuinely spans platforms, prefer splitting into one ticket per platform (see "Splitting"); if one ticket must cover both, tag the primary platform and say so in the body. After the tag: short enough to scan in a board view, specific enough to distinguish from similar work, area first when helpful ("[BE] Auth: Support SSO via SAML" rather than "[BE] Add SSO").

   One rendering caveat: `[FE](web)` is link syntax in Markdown, so in the draft it will display as a link labeled FE. That is expected; the raw text is what gets pasted into Jira's summary field, where it renders literally.

2. **A structured description in the team's format for the ticket type.** There are two formats, one template file each in this skill's `templates/` directory:

   - **QA bug** - Preconditions, Steps to reproduce, Actual results, Expected results. For defects found in testing or behavior that contradicts a spec. Template: `${CLAUDE_SKILL_DIR}/templates/qa-bug.md`.
   - **Task** - Design (only when there is a visual surface), then the specification as opening prose with no heading, then Required changes and Acceptance Criteria. One shared structure for both product/feature work and tech debt; the template says how the opening reads for each flavor. Template: `${CLAUDE_SKILL_DIR}/templates/task.md`.

   Pick the type from the first argument when the user names one: qa routes to the QA bug template, and feature or techdebt both route to the task template with the matching flavor. Otherwise infer the type from the material and state which format you chose, so a wrong guess is caught in one glance. Read the matching template file before writing: it carries the per-section guidance and the exact output skeleton.

3. **A parent.** Every ticket has a parent: a subtask's parent is its task, a task's parent is its epic, and a QA bug is typically filed as a bug subtask under the story or task whose behaviour it breaks. Find candidates per "Parent and duplicates" below and put a `Parent:` line with the key at the top of the draft. Attach to an existing parent whenever one fits; only propose a new parent under the hierarchy rules in "Splitting" below. A draft without a parent is not finished; if no parent can be found or confirmed, say so explicitly and ask.

## Parent and duplicates: the two allowed read-only Jira checks

Both checks run before the draft is finalized. Both are read-only; the never-create rule above stays in force. Both must be cheap: each is one narrow search, not an exploration.

**Finding the parent.** One Jira search for candidate parents in the ticket's domain (open epics for a task, open tasks or stories for a subtask or bug), requesting only key and summary, capped at about ten results. Propose the best match as the `Parent:` line and name the runner-up if the choice is not obvious. When nothing matches, or Jira is not reachable, ask the user for the parent key instead of guessing one.

**Checking for duplicates.** One JQL search built from the two or three most distinctive words of the draft title (project scope, open or recently updated, summary match), requesting only key, summary, and status, capped at about ten results. Compare against the summaries only; fetch a full issue only when a summary looks like a genuine match. If a likely duplicate exists, stop and report its key and title instead of finalizing the draft, and let the user decide between updating the existing ticket and proceeding anyway. If Jira is not reachable, finalize the draft and say the duplicate check was skipped. Never widen the search or page through results; the whole check should cost a few hundred tokens.

## Length and brevity

Tickets must be short. A developer should be able to read the whole thing in well under a minute. The description is a pointer to the work, not documentation of it.

Per-section length limits live in the template files. The rule is the same everywhere: a section is a few sentences or a few short bullets, never an essay, and a section with nothing real to say is omitted rather than padded.

The opening specification is where this fails most often. Three dense paragraphs of current state, measurements, and weighed alternatives is a design doc wearing a ticket's headings. Cap it at roughly 120 words and move the evidence out: if the reader needs the derivation to trust the direction, link it rather than inlining it.

When you have a large investigation behind the ticket, resist dumping it in. Compress to the decision and the direction. Cite a representative file or two, not every occurrence. If exhaustive detail is genuinely needed, that is a separate doc, not the ticket body.

## Splitting: only along a real seam, never to hit a number

Default to one ticket. Splitting is justified only when the work has a natural seam, meaning each piece is something a developer could pick up, finish, and have verified on its own. These are real seams:

- **Separate deliverables.** Backend and frontend halves, or two applications, each delivered and reviewed separately.
- **Independent shippability.** A subset that could ship alone and be verified alone, whether or not the rest ever lands.
- **Two outcomes.** The title needs "and" to be accurate, because it describes two things a user would notice separately.
- **Separate defects.** A QA report describing more than one defect: one ticket per defect, since they are fixed and verified separately.

These are not seams, and splitting on them produces tickets nobody can work with: a long acceptance-criteria list that all describes one behaviour, the layers of one change (data-transfer object, service, controller), or the steps of one implementation. Size is a symptom to check, never a reason on its own; if a ticket is long but has no seam, it stays one ticket and you say so.

Before splitting, state the seam in one sentence ("backend endpoint and mobile screen ship separately"). If you cannot name a seam that way, do not split.

**Hierarchy rules.** A parent ticket exists to hold work that has genuinely separate parts, so:

- **Never create a parent with one subtask.** A parent with a single child is pure overhead: two tickets to track one piece of work. If the split yields one real piece, it was not a split; write the single ticket.
- **Two pieces are siblings, not a new hierarchy.** Draft them under the existing parent (the epic or task the work already belongs to) rather than inventing a parent to hold exactly two children.
- **Create a new parent only at three or more subtasks**, and only when the pieces are parts of one deliverable that nobody would ship separately. The parent then carries the shared context and outcome, and each subtask carries one piece.
- **Prefer an existing parent over a new one.** When an epic or task already covers this work, attach to it; new hierarchy is the last resort, not the default.

**Grouping rules for a whole tree.** When drafting a set of tickets under one epic or initiative, rather than a single ticket:

- **Group by domain, not by document.** Containers follow the part of the system the work touches: the service that owns it, or the data it changes. They do not follow how the source specification is chaptered. A specification with four use cases frequently becomes two or three containers, because several use cases touch the same rows in the same service. Ask what each piece changes, not which section it came from.
- **Give containers short noun titles.** The name of the area ("Membership", "Content"), not a sentence describing the work inside it.
- **Write the shared reasoning once, on the container.** The architecture, the context, and the decisions live on the parent; each child carries only its own piece. Never repeat the same background across siblings, because the copies drift the moment one is edited.
- **Do not draft postponed work.** When a piece is explicitly deferred or blocked on something that does not exist yet, note it in the container rather than creating a ticket. A tracker full of tickets nobody can start is a tracker nobody trusts, and the note is enough to keep the gap visible.
- **Get the unit of work right before the grouping.** The leaf tickets, each one deliverable and verifiable on its own, are what people actually work from; the containers above them are navigation. When the two disagree, keep the leaves and rearrange the containers.

When you do split, produce complete drafts for every piece, each self-contained per the rules above, plus one line at the top stating the seam, the shape (siblings under an existing parent, or a new parent with its subtasks), the suggested order, and any dependency between them. Splitting is the deliverable in that case, not a failure to deliver one ticket.

## Working with different inputs

People will hand you all sorts of raw material. Here's how to handle it:

- **Rough notes or brain dump**: Extract the core intent. Ask yourself "what is this person actually trying to get done?" and build the ticket around that. Fill in reasonable implementation notes and edge cases based on what you can infer - but flag anything you're guessing about.

- **Conversation excerpt or Slack thread**: Distill the decision and action items. Strip out the back-and-forth and extract the agreed-upon scope. If there were unresolved questions in the conversation, surface them in Edge Cases.

- **Existing vague ticket that needs rewriting**: Preserve the original intent but restructure into the standard sections. Add specificity where the original was hand-wavy. If the original ticket is ambiguous enough that you're not sure what it means, ask the user which reading is right rather than shipping a draft built on a guess.

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

### Link every ticket key and source document

Every reference to a tracker issue is a Markdown link on the key: `[HUD-1234](https://hudd.atlassian.net/browse/HUD-1234)`, built from the tracker base URL in Project settings. A bare key is never acceptable, including a key you cite in passing inside a Required changes bullet. The description gets read in search results, in exports, and pasted into Slack, where nothing auto-links it, so a bare key costs the reader a search every time.

Every reference to a use case, specification, design document, wireframe set, or any other document is a Markdown link to it, with a heading anchor when the document has one:

```
[Use case 2. Sign in](https://hudd.atlassian.net/wiki/spaces/Space/pages/123/Auth+and+Profile#Usecase2.Signin)
```

Never a bare "Use case 2", "screen 6", or "per the auth spec". A named reference with no link makes the reader go and find the document, and it stops meaning anything the moment that document is renumbered or reorganised.

Get the URL before writing the ticket rather than leaving the link for later: an unlinked reference reads as finished, so nobody goes back to fix it. When something genuinely has no URL, name it in full and say where it lives instead of citing it by number alone.

The Jira summary field is plain text, so a key in the title stays bare. This rule covers the description only.

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

The ticket should be self-contained: someone picking it up shouldn't need to track you down and ask "what did you mean?"

**No dates, and no provenance for a decision.** State what is true and move on. Write "deferred", never "deferred by decision on 2026-08-20"; write "the eID gate is not built", never "ratified on 2026-08-13, see the decision log". The same applies to stamping your own research: "no ticket covers this" rather than "checked 2026-08-20, no ticket covers this". Jira already records when a thing was written and by whom, so a date in the body is noise on the day it is written and wrong a month later, and naming a decision's date or author invites the reader to go and re-litigate it instead of doing the work. Present-tense measurements stay allowed, exactly as the no-estimates rule has it: "the current p99 is 50ms" is an observation, not provenance.

**Never cite anything by number.** Not a rule, not a checklist item, not a sibling ticket. State what the thing requires, or name it, and move on. Write "so `apps/payments` may import it later", never "so `apps/payments` may import it under boundary rule 4". Never "per ADR-001", "item 12 of the checklist", "rule 3 of the module boundaries", "see constraint 2 above". The number means nothing to the reader without opening another document, and it is wrong the moment that document is reordered.

This applies hardest to **sibling tickets in the same draft set**: never "ticket 1 owns the config", "the outbox lands in ticket 2", "blocked on tickets 1 and 2". Those numbers exist only in the drafting file's own table, and a ticket is read alone in Jira where they mean nothing at all - worse, once the set is created the numbering is replaced by issue keys that do not match. Refer to a sibling by **what it is** ("the outbox ticket", "the Centrifugo integration", "the deployment ticket"), and once it exists in the tracker, by its linked key. A local ordering line directly beneath the table may use the table's own row numbers; nothing in a ticket body may.

**No positional references either.** A ticket body has no "below", "above", "earlier", "the next ticket", or "in this file" - it is one issue on a Jira screen, not a section of a document. Write "the Centrifugo deployment ticket", never "the deployment ticket below"; write "the partitioning rule explains why", never "see partitioning below". These break twice over: the reader has nothing to look at, and the direction silently goes stale the moment bullets or tickets are reordered - a "below" pointing at something that ended up above is the normal outcome. Write every ticket as though the reader opened it directly from a search result and has never seen the drafting file.

**A ticket never contains an open question.** No "Open question", no "TBD", no "to be decided", no "confirm with product", no section listing what you could not work out. A ticket is something a developer starts working from, and a question inside it means nobody can start. When a decision is genuinely unclear and different answers would produce different work, **ask the user in chat before writing the draft** and bake the answer in. Ask as many questions as it takes, in one round where possible; the questions are cheap and a ticket that has to be re-litigated in a comment thread is not. The only thing that may look like an unresolved item is a `Parent:` line that could not be verified because the tracker was unreachable, and a named follow-up that is deliberately out of scope.

## What not to do

- Don't pad tickets with boilerplate or filler. If a section would just say "N/A" or repeat the title, leave it out.
- Don't over-specify implementation details - leave room for the implementer's judgment.
- Don't invent requirements that weren't in the input. When something is ambiguous, ask the user in chat and write the answer into the ticket. Never make the assumption silently, and never park the ambiguity in the ticket body as an open question (see "Tone and style").
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

- **Tracker:** Jira, project key `HUD`. Issue links are `https://hudd.atlassian.net/browse/<KEY>`.
- **Platform tags:** `[BE]` backend services; `[FE](web)` the web app and admin panel; `[FE](mobile)` the mobile app.
- **Code host:** `https://github.com/galdrdev/<repo>`, one repository per top-level workspace folder.
- **Reference bug ticket:** HUD-3963 shows the QA bug format applied.
- **Accessibility:** WCAG 2.1 AA is a legal requirement for this product; any change with a user-facing surface carries accessibility acceptance criteria (the task template enforces this).
