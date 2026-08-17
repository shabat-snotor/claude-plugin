---
name: retro
description: Review this session for durable findings, then update the instruction, README, and architecture docs that are now wrong or missing them
argument-hint: "[optional: an area to focus on, or a specific doc to check]"
disable-model-invocation: true
---

Look back over this session and work out what the project's documentation should
have said before the session started. Focus on: $ARGUMENTS (when that is empty,
the whole session).

The deliverable is a set of documentation edits, proposed before they are made.
Most sessions produce one or two, many produce none. If this one produced none,
say so plainly and stop; inventing a doc change to have something to show is the
failure mode this command exists to avoid.

## Phase one: collect candidates

Go back over the entire session, not only the last thing that happened. A
candidate is something a future reader of the docs would need and could not get
cheaply by reading the code.

Look for:
- Something that surprised you, or that took more than one wrong attempt: a
  non-obvious ordering, a failure whose cause was nowhere near its symptom, a
  tool or flag that behaves differently than its name suggests.
- A decision taken in this session whose reason is invisible in the diff: why
  this approach and not the obvious alternative.
- A convention or constraint the user corrected you on, including corrections
  about how to work rather than what to build.
- Structural facts that a doc enumerates and this session changed: a service,
  endpoint, environment variable, flag, topic, table, script, or command that
  was added, renamed, or removed.
- Anything an existing doc asserts that this session proved stale or wrong.
  This is the highest-value kind, and the easiest to walk past.
- A setup or verification step that was not written down anywhere and had to be
  reconstructed.

Exclude ruthlessly. Most of a session is not documentation:
- Anything a reader gets by reading the code or the commit history.
- The narrative of the work: what you tried, in what order, what failed.
- Detail that belongs to the ticket or the incident rather than to the project.
- Restating structure the code already makes obvious.
- Anything you inferred but never confirmed. If you want it recorded anyway,
  verify it now, or record it explicitly as an open question. A confidently
  wrong instruction file costs more than a thin one.
- Credentials, personal data, and anything else that must not be written down.

## Phase two: find the file each candidate belongs in

Read the docs that already cover the area, in full, before proposing any edit.
The common failure is adding a paragraph two screens away from the paragraph
that already says the same thing, or contradicts it.

- Prefer the narrowest file that covers the topic: a per-service or
  per-directory instruction file over the repository-wide one, a module's own
  document over the README.
- Sort by what the file is for. The README is what someone needs in order to
  use, install, or run the thing. The instruction file is how to work inside
  the repository, and what to watch out for. An architecture document or
  decision record is why the design is the way it is, and what was rejected.
  Put each candidate where a reader would go looking for it, not wherever it is
  easiest to append.
- Where existing text is now wrong, the edit is a correction to that text, in
  place. Never leave the wrong sentence standing next to the right one.
- Where a candidate has no home at all, prefer the smallest new section in an
  existing file. Propose a new file only when the material clearly does not
  belong in any existing one, and name the file and its location for approval
  rather than creating it.

## Phase three: propose, then apply

Report, before editing anything:

- One line per candidate: what it is, which file, whether the edit corrects,
  adds, or deletes, and why it earns a place in a document people have to keep
  reading.
- The candidates you rejected, one line each with the reason, so a judgement
  call of yours can be overturned by me.
- Anything you could not verify, kept separate from what you confirmed.

Then wait. Do not edit a file until I answer.

Once I have said which items to apply, apply only those:
- Match the surrounding file: its heading levels, its voice, and its density. A
  document that reads as though two people wrote it is trusted less.
- Keep each entry to the shortest form that still makes sense to someone
  reading it cold, and anchor it to something concrete: a path, a command, a
  symptom, an error message.
- Delete what the change made false instead of appending a correction below it.
- Do not reformat, reorder, or improve any part of the file you were not asked
  to touch.
- Do not move project-specific material into a file that leaves the project,
  such as a public repository, a shared plugin, or a template.

Then report the path of every file you changed, and repeat anything you decided
not to record, so that it is dropped visibly rather than silently.
