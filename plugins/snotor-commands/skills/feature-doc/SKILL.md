---
name: feature-doc
description: The handover document for a finished feature, with sections for integration, QA, and product
argument-hint: "<feature, module, or pull request; optionally lead with one audience: integration, qa, or product>"
disable-model-invocation: true
---

Write the handover document for: $ARGUMENTS

One document, up to three sections, each written for its own reader. Produce
all three by default; when the first argument names one audience (integration,
qa, product), produce only that section.

Ground everything in the code before writing: the diff, the controllers, the
data-transfer objects, guards, and serializers. Never guess a field name, a
type, or a default: if you did not read it, mark it unverified. Collect the
file paths and line numbers you verified against into an appendix at the end
so a reviewer can check the document quickly.

## Section 1: Integration (for the web and mobile developers)

Self-contained: no references to documents the reader cannot see. For each
endpoint in scope:

- Method and path as the client actually calls it (through the gateway or
  proxy when the project has one), and the authentication it requires.
- Request and response shapes: every field with its type, whether it is
  required, its validation limits, its default, and which fields appear only
  with an include or fields query parameter.
- Feature flags that gate the behaviour, and exactly what the caller sees
  when the flag is off (a 404, an empty list, a missing field).
- Error responses the client must handle, with status codes and when each
  one occurs.
- Pagination, sorting, and filtering parameters where the endpoint supports
  them.
- Anything delivered outside the request cycle: websocket events, push
  notifications, or counters that update asynchronously, with the timing the
  client should expect.

End the section with a worked example: one realistic request and its
response, built from the actual data-transfer objects rather than invented.

## Section 2: QA notes (for the tester)

Short: a handful of bullet points naming what deserves testing attention, not
a step-by-step checklist. The tester knows how to test; tell them what they
could not know from the outside:

- The feature flags that must be enabled before anything is testable
  (flag-gated behaviour silently takes the flag-off branch otherwise), and any
  accounts or data the setup needs.
- The riskiest behaviour changes, and why they are the risky ones.
- The adjacent behaviour most likely to regress.
- Any edge case the change does not clearly handle, phrased as a question for
  the tester rather than an assertion.

Keep the whole section under roughly ten bullets.

## Section 3: Product summary (for product and business readers)

Not for engineers: expand every acronym at first use, no layer talk, describe
behaviour as what a user or the business sees. Cover: what the feature does,
in a few sentences a stakeholder could repeat; where it stands (shipped,
behind which feature flag and for whom it is on, partially built, and what
remains); what is deliberately out of scope, so nobody assumes it exists;
known limitations and risks in plain terms, with what removing each involves
stated as ordering and relative size, never as dates; and open product
questions that need an owner. Where the shipped behaviour differs from what
the ticket promised, that difference leads the section. Do not invent
numbers; name the measurement someone could run instead of guessing a value.

End the document with anything you could not verify from the code, listed
plainly, so every reader knows where the document itself might be wrong.
