---
name: explain-diff
description: "Walk through the current diff as if it has to be defended in review, naming the weak parts rather than summarizing favourably. Use when the user asks what changed, asks to explain, review, or walk through the current diff, the working tree, or the branch, or wants to know what they are about to put in a pull request. Not for making the changes."
disable-model-invocation: false
---

Walk me through the current diff as though I have to defend it in review, and I
have not read it yet.

For each file, in order:
- What changed, in plain language.
- Why that change was necessary for the stated task.
- What breaks if this part is wrong, concretely.
- Anything here that I did not ask for.

Then answer three questions directly:
- Which parts of this diff would you struggle to justify to a skeptical reviewer?
- Which parts duplicate something that already exists in the codebase?
- Which values in this diff (timeouts, retries, page sizes, cache lifetimes,
  concurrency limits) were chosen for a reason, and which were filled in with a
  plausible default?

Do not summarize favourably. If a part of the diff is weak, say which part.
