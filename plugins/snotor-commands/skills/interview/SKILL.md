---
name: interview
description: Interview me about a feature until a written specification exists
argument-hint: <one-line description of the feature>
disable-model-invocation: true
---

I want to build: $ARGUMENTS

Interview me about it, one round of questions at a time. Dig into the parts I
have probably not decided yet: technical approach, interface behaviour, edge
cases, failure handling, what is out of scope, and the trade-offs I am making
without noticing. Skip anything with an obvious answer. Where the codebase
already constrains the answer, read the code and tell me, instead of asking.

Keep going until the open questions are gone, then write the result to a
specification file named after the feature. The specification must name the
files and interfaces involved, state what is out of scope, and end with an
end-to-end check that proves the feature works.

Do not start implementing. The specification is the deliverable, and
implementation happens in a fresh session against it.
