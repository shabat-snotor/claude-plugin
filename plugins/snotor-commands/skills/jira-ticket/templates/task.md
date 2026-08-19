# Task format (product / feature and tech debt)

One structure for every non-bug ticket, so a developer reads product work and
tech debt the same way. The two flavors differ only in what the opening
paragraphs say and in whether Design exists.

Section guidance:

- **Design** - only when the change has a visual surface: link the design
  source. Omit the section entirely otherwise; tech debt tickets almost never
  have one.
- **The specification, which carries no heading of its own** - the
  description opens straight into it. A heading reading "Specification"
  only names what the paragraph already is, and costs a line every reader
  scrolls past. What should be true when the ticket is done, and why.
  **Hard cap: roughly 120 words, and at most two short paragraphs.** For a
  feature: the behaviour from the user's point of view (what the user can do
  and see, and when), in plain language a product person can confirm is what
  they meant. For tech debt: one or two sentences on the current state
  (concretely what is wrong or missing, no history lessons), then the target
  state and the why (performance, reliability, developer experience).
  Nothing else belongs here. Measured baselines, benchmark tables, rejected
  alternatives, and the reasoning that produced the approach are derivation,
  not specification: the chosen direction gets one clause and the evidence
  goes in the merge request or a linked doc. When it runs long, the
  excess is a Required changes bullet or an Acceptance Criteria line, not a
  third paragraph.
- **Required changes** - where the work lands (services, applications,
  endpoints, screens, key files) as short directional bullets. Direction, not
  a spec. Omit when the path is obvious; trust the implementer with the
  details.
- **Acceptance Criteria** - checkable statements that define done, one
  observable outcome each, verifiable by a reviewer or tester. Phrasing each
  as precondition, action, and outcome helps both the tester and whoever
  writes the tests. Genuine edge cases belong here as criteria naming the
  edge and what must still hold; do not invent boundary conditions to look
  thorough. When the change has a user-facing surface and the project carries
  accessibility requirements (see the skill's Project settings), include the
  accessibility criteria for the affected screens: keyboard operability,
  screen-reader naming and state announcements, focus behaviour, and text
  scaling. Accessibility is part of done, not a follow-up ticket.

Output skeleton:

## [Title]

### Design

...

[the specification, one or two paragraphs, no heading]

### Required changes

- ...

### Acceptance Criteria

- ...
