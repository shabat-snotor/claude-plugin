---
name: work-on
description: Investigate a task, report findings, wait for a go-ahead, then implement it
argument-hint: <ticket key, or a description of the change>
disable-model-invocation: true
---

Work on: $ARGUMENTS

Run this in two phases. Do not merge them. Do not start phase two on your own.

## Phase one: investigate

Read only. Do not edit any file in this phase.

Use subagents for any search that spans more than one service, so this session
keeps room for the implementation.

**Start from the ticket. Do not re-derive it.** When the argument is a ticket
key, read the ticket before touching the codebase. A ticket written to this
team's standard already names the gap, the files and rules to reuse, the
specification behind it, what is deliberately out of scope, and the acceptance
criteria. That is the brief. Rebuilding it from the codebase spends the budget
phase two needs and arrives at the same answer.

Spot-check it rather than either trusting it or redoing it: one read or one grep
per file, symbol, or rule the ticket names, enough to confirm it still exists
and still says what the ticket claims. A claim that no longer holds is the most
valuable thing in this phase, and it leads the report.

Then spend the rest of the budget on the four things a ticket structurally
cannot carry, because it is capped at a length that excludes them:

1. **What this change breaks.** Every existing test touching the routes,
   services, or helpers involved, and per hit whether it still passes and still
   proves what its name claims. Hardcoded route lists, shared test helpers, and
   assertions over generated documents are the usual casualties.
2. **Where two rules collide.** The ticket's acceptance criteria read against
   the instruction files and the per-module documentation. Quote both sides. A
   collision is a decision, not a detail.
3. **What is still undecided.** Anything the ticket left open, plus any fork the
   ticket did not see.
4. **Where the new code belongs**, when the ticket named the behaviour but not
   the placement, and what the ownership and boundary rules force.

Investigate from scratch only what the ticket does not answer, which is the
normal case for a bare description rather than a key, and for a ticket that
turns out to be thin. Say which of the two you are in. On that path, answer
these as well: whether an equivalent already exists and where, who calls the
code involved and what each caller assumes, which tests cover it today, which
instruction-file sections apply, and what the change would touch that is
expensive to reverse.

Then stop and report:

- **What I found**, with a file path and line number for every claim, leading
  with any ticket claim that no longer holds.
- **Recommendation**, which must be one of: proceed as asked; proceed with a
  smaller change than asked, described; this is already done or unnecessary,
  with the evidence; this needs a decision I should not take alone, and why.
- **The plan**, if you are recommending proceeding: what changes, in what order,
  which tests get added, which existing tests need auditing.
- **Verified against inferred**: two lists, so I can see which parts of the
  above you confirmed by reading a file.

If the change is too large to review in one sitting, say so and propose the
first piece rather than proposing all of it.

**Every decision that is mine to make gets asked, not described.** A decision is
anything where two defensible answers would produce different code: a contract
or schema shape, which of several behaviours is correct, whether a rule gets an
exception, what a thing is named, whether something is in scope. Ask it with the
question tool, one question per decision, with the options spelled out and your
recommendation marked. Never leave a decision as a sentence in the report for me
to notice; if it is buried in prose, it did not get asked. State your
recommendation and the trade-off inside the options, so answering takes one
click and not a conversation.

Decisions you can settle yourself, because only one answer is defensible, are
settled and reported in one line. Do not ask about those.

Then wait. Do not write code until I answer.

## Phase two: implement

Only after I say to go, and only the piece we agreed on.

- Follow the instruction-file sections you quoted in phase one.
- Reuse what exists. If you add a helper, first show nothing equivalent is there.
- Every new function, endpoint, listener, or module needs a caller in this same
  change. If it does not have one, do not add it, and tell me why it seemed needed.
- Test the new behaviour at both levels: unit tests for the service logic, and
  e2e tests for any endpoint whose request or response behaviour changed. Add
  them to the existing spec file for that service or route; create a new spec
  file only when no related one exists, and say that you did. If the behaviour
  is gated by a feature flag, the e2e test must enable the flag explicitly
  through the project's mechanism (a header, a config toggle), or it silently
  exercises the flag-off branch and proves nothing.
- Audit the existing tests around what you changed: search the test
  directories for the route path and the service method names, and decide per
  hit whether the test still passes and still proves what its name claims.
  Update the ones the change breaks or hollows out.
- Verify in this order, and put the real output of each step in the report:
  type check, lint, unit tests for the touched area, integration or e2e tests
  when the change crosses a service or client boundary, and for anything
  user-facing, exercise the change in the running application with a
  screenshot or request log as proof. A step you skipped is reported as
  skipped, never implied as done. An audit without a test run is a guess, not
  an audit.
- No comments in the code.
- Do not rename, reformat, or improve anything outside what we agreed.
- If a decision surfaces mid-implementation that phase one did not reach, stop
  and ask it with the question tool before writing the code that depends on it.
  Do the parts that do not depend on the answer, and say what is waiting.

Then report, in this order: what changed and where, which commands you ran and
their actual output, what passed, what you skipped, and what you left out on
purpose.
