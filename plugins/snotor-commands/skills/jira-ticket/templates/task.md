# Task format (product / feature and tech debt)

One structure for every non-bug ticket, so a developer reads product work and
tech debt the same way. The two flavors differ only in what the opening
paragraphs say and in whether Design exists.

Section guidance:

- **Design** - only when the change has a visual surface: link the design
  source. Omit the section entirely otherwise; tech debt tickets almost never
  have one.
- **The specification. Two hard limits, and they are limits, not
  preferences:**

  1. **No heading of its own.** The description opens straight into the
     prose. Never write a line reading "Specification", "Overview",
     "Context", "Background", or "Summary" above it. A heading there only
     names what the paragraph already is.
  2. **At most two paragraphs and at most 120 words, counted.** Not "aim
     for" - if there is a third paragraph, or the count is over, the ticket
     is not finished. Count before moving on.

  Inside those limits: what should be true when the ticket is done, and why.
  For a feature, the behaviour from the user's point of view (what the user
  can do and see, and when), in plain language a product person can confirm
  is what they meant. For tech debt, one or two sentences on the current
  state (concretely what is wrong or missing, no history lessons), then the
  target state and the why (performance, reliability, developer experience).

  **Where the excess goes, because it is always the same two places.** A
  direction, a file, a table, a schema, an interface: Required changes. An
  observable outcome or a rule someone tests: Acceptance Criteria. A
  measured baseline, a benchmark table, a rejected alternative, or the
  reasoning that produced the approach is derivation and belongs in the
  merge request or a linked doc, not the ticket. Restating in the opening
  what a bullet below already says is the most common way the cap gets
  blown - cut the restatement, not the bullet.
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

At most two paragraphs, at most 120 words, and no heading above them: the
first section heading in the body is Design when there is one, and
Required changes otherwise. This bracketed note is not literal text.

### Required changes

- ...

### Acceptance Criteria

- ...
