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

Find out:
1. Does an equivalent already exist in this codebase? If it does, say so first,
   with the path.
2. What are the callers of the functions, endpoints, or services involved, and
   what does each one assume?
3. Which tests cover this path today?
4. Which parts of the project and per-service instruction files apply? Quote them.
5. What would the change actually touch, and is any of it expensive to reverse?

Then stop and report:

- **What I found**, with a file path and line number for every claim.
- **Recommendation**, which must be one of: proceed as asked; proceed with a
  smaller change than asked, described; this is already done or unnecessary,
  with the evidence; this needs a decision I should not take alone, and why.
- **The plan**, if you are recommending proceeding: what changes, in what order,
  which tests get added, which existing tests need auditing.
- **Verified against inferred**: two lists, so I can see which parts of the
  above you confirmed by reading a file.

If the change is too large to review in one sitting, say so and propose the
first piece rather than proposing all of it.

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

Then report, in this order: what changed and where, which commands you ran and
their actual output, what passed, what you skipped, and what you left out on
purpose.
