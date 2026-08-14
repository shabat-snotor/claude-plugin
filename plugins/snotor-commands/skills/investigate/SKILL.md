---
name: investigate
description: Read-only investigation of a question, with no implementation to follow
argument-hint: <the question to answer>
disable-model-invocation: true
context: fork
---

Read-only investigation of: $ARGUMENTS

Do not edit any file, and do not propose an implementation. The deliverable is
an answer.

Use subagents for any search that spans more than one service.

Give a file path with a line number for every claim. Where behaviour depends on
a runtime value (an environment variable, a feature flag, a header), say so and
name it rather than describing only the code path you happened to read.

End with two lists: what you verified by reading a file, and what you inferred.
Put anything you are unsure about in the inferred list.
