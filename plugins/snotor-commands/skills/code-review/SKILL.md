---
name: code-review
description: "Two-axis review of a diff, branch, or pull request, reported as paste-ready review comments. The Standards axis asks whether the change follows the repository's documented conventions and avoids known design smells; the Spec axis asks whether it does what the ticket asked. Each axis runs as an isolated sub-agent, so neither one biases the other. Use when the user asks to review a diff, a branch, a pull request, or the working tree, asks what a reviewer would say, asks whether a change is ready to merge, or asks to check a change against its ticket."
argument-hint: <branch, PR number, file path, or nothing for the working diff>
disable-model-invocation: false
---

Review the target in $ARGUMENTS: a branch, a pull request number, a file path,
or the working diff. If no argument was given, review `git diff
@{upstream}...HEAD`, falling back to `git diff main...HEAD`, then `git diff
HEAD`.

Before spawning sub-agents: confirm the target resolves (`git rev-parse
<target>`) and the diff is non-empty. A bad ref or an empty diff fails here,
not inside two parallel sub-agents. Capture the diff command and `git log
<target>..HEAD --oneline` once, and pass both to each sub-agent verbatim.

## Why two axes

A change can pass one axis and fail the other: code that follows every
convention but implements the wrong thing, or code that does exactly what the
ticket asked but breaks the project's own patterns. Reporting the axes
separately stops one from masking the other. Do not merge or rerank findings
across axes, and do not declare one overall winner.

## Non-negotiable output contract

The deliverable is a list of **paste-ready pull request comments**, one per
finding (including nits), that the reviewer can copy straight onto the pull
request. Each sub-agent must produce findings in exactly this block shape, not
free prose:

```
### <n>. <one-line title>  -  <category>

**Where:** `path/to/file.ts:LINE` - inside `functionOrClassName()`
**Permalink:** <blob URL for this code host, see Project settings>

**What:** <1-3 sentences: the defect and the concrete failure scenario or cost.>

**Suggested comment:**
> <exact text to paste as the review comment. Second person, addressed to the
> author, specific, with the fix. Quote the relevant project instruction rule
> verbatim if the finding is a convention violation.>
```

Categories:
- Standards axis: `correctness | efficiency | altitude | reuse | simplification | conventions | smell`
- Spec axis: `missing-requirement | scope-creep | wrong-implementation`

Rules for the block:
- `Where` must carry both `file:line` and the enclosing function, class, or
  method name. If the enclosing symbol cannot be named, read more context
  first.
- Build the permalink from the code host in Project settings. Get the full SHA
  with `git rev-parse <branch/HEAD>` and run it as its own step: never put
  `$(...)` inside the URL, it renders literally. Derive owner, group, and
  repository from `git remote get-url origin`, and pick the blob URL shape
  that matches that host, because the line-anchor syntax differs between
  hosts. Give at least one line of context on each side, so a comment on line
  62 spans lines 60 to 64.
- The `Suggested comment` is required even for small or nit findings.
- Order findings most severe first within each axis; correctness outranks
  cleanup, altitude, or convention findings.

## Step 1: identify the Spec source

Look, in order:

1. A tracker key matching one of the patterns in Project settings, in the
   commit messages or the branch name. Fetch the ticket through the tracker's
   tools if they are available. Call the tool before concluding it is
   unavailable: a startup notice about authentication is often stale.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch
   name or the feature.
4. If nothing is found, ask the user where the spec is. If they say there is
   none, skip the Spec sub-agent and note "no spec available" in the final
   report instead of guessing at intent.

## Step 2: identify the Standards sources

- Every governing project instruction file: user-level, repository root, and
  any in an ancestor directory of a changed file. `CLAUDE.md` and `AGENTS.md`
  both count.
- The Fowler smell baseline below, which applies even where the repository
  documents nothing. A documented repository standard always overrides the
  baseline where the two conflict. Every smell is a labelled judgement call,
  never a hard violation; skip anything tooling already enforces.

Fowler smell baseline (paste this list into the Standards sub-agent's prompt in
full, it has no other access to it):

- **Mysterious Name**: a function, variable, or type whose name does not
  reveal what it does or holds. Rename it; if no honest name comes, the design
  is murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or
  file in the change. Extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than
  its own. Move the method onto the data it envies.
- **Data Clumps**: the same few fields or parameters keep travelling together.
  Bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain
  concept that deserves its own type. Give the concept its own small type.
- **Repeated Switches**: the same switch or if-cascade on the same type
  recurs across the change. Replace with polymorphism, or one map both sites
  share.
- **Shotgun Surgery**: one logical change forces scattered edits across many
  files in the diff. Gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated
  reasons. Split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for
  needs the spec does not have. Delete it; inline back until a real need
  shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller should not
  depend on. Hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. Cut
  it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides
  most of what it inherits. Drop the inheritance, use composition.

## Step 3: spawn both sub-agents in parallel

Send both `Agent` tool calls in a single message so they run concurrently.
Neither sub-agent sees the other's context.

**Standards sub-agent** gets:
- The diff command, the commit list, and the target.
- The Standards-source file list from step 2, plus the smell baseline pasted
  in full.
- The brief: "Read every changed file in full, not just the changed hunks. A
  small diff hides issues that are only visible in the surrounding code. Trace
  callers and callees of every changed symbol for broken preconditions,
  changed return shapes, new exceptions, and dead code left with no caller.
  Also hunt reuse (an existing helper the new code should call),
  simplification (redundant or dead code the diff adds), efficiency (wasted
  work, per-request I/O, unbounded queries, N+1 calls), and altitude (bandaid
  fix versus root cause). Report every place the diff violates a documented
  project instruction (quote the file and the rule) and every baseline smell
  you spot (name it, quote the hunk). Distinguish hard violations
  (documented-standard breaches) from judgement calls (baseline smells are
  always judgement calls). Also surface pre-existing issues visible in the
  surrounding code that the diff perpetuates or should have touched, labelled
  clearly as pre-existing versus introduced by this change. Dedup
  near-duplicates: if several findings share one root cause, say so. Emit
  every finding using the paste-ready block format from the parent prompt,
  category one of correctness, efficiency, altitude, reuse, simplification,
  conventions, or smell."

**Spec sub-agent** gets:
- The diff command, the commit list, and the target.
- The fetched ticket or spec file contents from step 1.
- The brief: "Report requirements the ticket asked for that are missing or
  partial; behavior in the diff that was not asked for (scope creep); and
  requirements that look implemented but where the implementation looks wrong.
  Quote the ticket line for each finding. Emit every finding using the
  paste-ready block format from the parent prompt, category one of
  missing-requirement, scope-creep, or wrong-implementation." If the spec is
  missing, skip this sub-agent and note it in the final report.

## Step 4: aggregate

Present the two reports under `## Standards` and `## Spec` headings, each an
ordered list of paste-ready blocks, most severe first within that axis. Do not
merge or rerank across axes. End with one line per axis: total findings and
the worst issue within that axis, if any. Never pick one overall winner across
axes, that reranking is what the separation exists to prevent.

## Step 5: writing pass (required)

Sub-agents do not receive the session's always-on house-style context, so
their output can carry AI tells (hedging, filler, long dashes, restated
questions) even when this skill's own output would not. Before presenting the
aggregated report, run an edit pass over the full text with the `unslop`
skill in this plugin (invoke `snotor-commands:unslop`, or read `../unslop/SKILL.md`
next to this file if the skill is not loaded). Register is code-adjacent for
every `Suggested comment` and `What` line: name the problem, say what breaks,
propose the fix, no opener, no closing thanks. Register is conversation for
the closing per-axis summary lines. Never use an em dash or en dash anywhere
in the output.

## Optional

After printing the paste-ready comments, ask whether to post them to the pull
request or merge request. Never post without an explicit yes: the user manages
their own git and code-host actions.

## Project settings (edit when reusing this skill in another project)

The rules above are project agnostic and reference the values here; reusing
this skill elsewhere means editing this block, nothing else.

- **Tracker:** Jira. Key patterns `HUD-\d+` (Hudd, `https://hudd.atlassian.net/browse/<KEY>`)
  and `DAYB-\d+` (Daybird, `https://daybird-hudd.atlassian.net/browse/<KEY>`).
  Fetch tickets with the `atlassian` connector's `getJiraIssue`.
- **Code hosts:** two, so derive the shape from `git remote get-url origin`.
  - GitHub, `github.com/galdrdev/<repo>` (the `hudd-*` repositories):
    permalink `https://github.com/<owner>/<repo>/blob/<FULL_SHA>/<path>#L<start>-L<end>`.
  - Self-hosted GitLab, `gitlab.daybird.com/<group>/<repo>` (the `daybird-*`
    repositories): permalink
    `https://gitlab.daybird.com/<group>/<repo>/-/blob/<FULL_SHA>/<path>#L<start>-<end>`,
    where the end anchor has no second `L`, and a pull request is a merge
    request.
- **Project instruction files:** `CLAUDE.md` at the user level, the repository
  root, and in workspace subdirectories. In the Daybird workspace each
  repository carries its own, and the workspace root carries one more.
