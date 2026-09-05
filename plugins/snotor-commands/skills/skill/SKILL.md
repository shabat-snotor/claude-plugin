---
name: skill
description: "Create a new team skill, improve an existing one, or undo a change to one - by talking it through, trying it on a real example, and publishing it to the whole team. Use when the user wants to make, add, write, create, build, edit, improve, fix, change, or revert a skill or a command, says Claude keeps getting some recurring task wrong, says they are tired of explaining the same thing every time, or asks how to share a way of working with the team. Works for anyone, with or without git."
argument-hint: "[nothing, or the name of a skill to improve, or a description of what you want]"
disable-model-invocation: false
---

# Make or improve a team skill

A skill is a written-down way of doing one recurring job, so Claude does it the same way for everyone. This skill turns a conversation into one, tries it on real work, and publishes it to the whole team.

Assume the person you are talking to has never written a skill and does not want to learn. They are a designer, a product owner, or a developer who wants the thing to exist, not a lesson. Never show them YAML, frontmatter, git commands, or file paths unless they ask. Never ask them to fill in a template. You do the writing; they do the judging.

## Pick the mode

From what they said, choose one and say which you picked in a single line before you start.

- **Improve** - they named an existing skill, or described something one of the existing skills already does badly. This is the most common case and the one to prefer: the library is more useful with eight good skills than twenty overlapping ones. It has extra steps, in [Improve an existing skill](#improve-an-existing-skill).
- **Create** - nothing in the library covers the job.
- **Undo** - they want a recent change to a skill reversed. Jump to [Undo a change](#undo-a-change).

If it is ambiguous, read the library catalog first (below), then say which mode you picked and why. Do not ask them to choose between words they do not have a definition for.

## Read the library first

Before anything else, read every existing skill's name and description:

- If you can reach the library on disk (see [Publishing](#publishing)), read the `description` line from each `skills/*/SKILL.md`.
- Otherwise read the catalog table in the library `README.md`.

You need this to catch overlap. If what they want is 70% covered by something that exists, say so plainly and propose improving that one instead:

> `write-sql` already does most of this - it writes a query and refuses to run it. What you're describing adds "explain what the numbers mean afterwards". That's a change to `write-sql`, not a new skill. Want me to do that?

Take their answer. If they still want a separate skill, make one - they may know something about how the two get used that you do not.

## The interview

One question at a time, in plain language, and never more than five questions total. Stop as soon as you can write the skill; a short interview that produces a good draft beats a thorough one that exhausts them.

Ask, roughly in this order, skipping anything they already told you:

1. **What should Claude do?** The job, not the wording. "Turn my rough notes into a ticket", not "you are an expert ticket writer".
2. **When should it kick in?** What would they type or say when they want this? Collect their actual phrasing - this is what makes the skill trigger later, and their words beat yours.
3. **Show me one good example.** Ask them to paste something they did by hand that came out right, or an example of the output they wish they got. **This is the most valuable question in the interview.** One real example teaches more than a paragraph of description. If they have one, everything after this gets easier; if they say they do not have one, ask what a bad version looks like instead, which is usually easier to produce.
4. **What goes wrong today?** Improve mode only, and usually you do not have to ask. The reason someone wants a skill changed is almost always sitting in the conversation you are already in: they ran it, the output was wrong, and they said so. Read back through this session for the actual failing case before asking anything. If they corrected it by hand in the conversation, **that correction is the worked example** and question 3 is already answered. Only ask when the session does not contain the case.
5. **Anything it must never do?** Often there is one hard rule: never run the query, never invent a ticket number, never use marketing language. Ask once; if nothing comes to mind, move on.

If they gave you enough in their opening message, skip straight to writing and say so: "I have enough - drafting it now, you'll see it in a second."

## Write it

Write `SKILL.md` into the library at `skills/<name>/SKILL.md`, where `<name>` is lowercase with hyphens and reads like the command someone would type: `jira-ticket`, `write-sql`, `explain-diff`.

**The description is the most important line in the file.** It is the only part Claude sees before deciding whether to use the skill, so it has to carry both what the skill does and when to reach for it. Write it as one block: what it does first, then "Use when..." with the person's own trigger phrases from question 2. Keep the whole thing under 1,000 characters - it is truncated at 1,536 in the skill listing, and a listing that overflows loses the keywords that make it trigger at all.

**The body is instructions to Claude, written as commands.** "Read the entity file before naming a column", not "it is important to be accurate". Structure it as the steps the job actually has:

- What to gather or read first.
- The rules that make the output right, each with the reason it matters when the reason is not obvious.
- **The worked example from question 3**, shown in full. Label it as an example of good output.
- What never to do, and what to do instead.

Keep it short enough to read in one sitting. A skill that is three screens long and precise beats one that is ten screens and hedged. Cut every sentence that would be true of any skill.

### Rules that keep a skill working everywhere

Follow these without mentioning them to the person unless they ask:

- **No inline shell injection in the body.** The syntax that runs a command while the skill loads (an exclamation mark immediately followed by a backtick-quoted command) is replaced with a placeholder in Cowork sessions, so a skill that leans on it works for developers and quietly breaks for everyone else. Tell Claude to run the command as an ordinary step instead.
- **No secrets, credentials, or personal data**, even though the library repository is private. Skills get pasted into tickets and shared in chat.
- **`name` in the frontmatter matches the folder name.** Anything else makes the command name unpredictable.
- **Supporting files go beside `SKILL.md` in the same folder**, referenced by relative path. Use them for anything long and reusable, such as an output template.
- Match the writing style of the skills already in the library: plain sentences, no em-dashes or en-dashes, minimal ceremony.

## Try it before you ship it

Do not skip this. It is the step that makes it safe to publish without review, and it is the step that makes a non-developer trust the result.

Run the skill you just wrote, in this session, on a real case - the example they gave you, or something they are actually working on right now. Show them the output.

Then ask one question: **is that what you wanted?**

- If yes, publish.
- If not, ask what specifically is off, change the skill, and run it again. Two or three rounds here is normal and is time well spent.

If the skill cannot be test-driven in this session because it needs a repository or a tool you do not have, say so, and instead show them the skill's instructions in plain English - "here's what it will do, in order" - and get their agreement on that.

## Publishing

Everything lands on `main` directly. There is no review step, on purpose: the test drive above is the quality gate, and [Undo a change](#undo-a-change) is the safety net.

Before publishing, always run the validator and fix anything it reports:

```bash
node scripts/validate.mjs
```

Then regenerate the catalog so the new skill appears in the README:

```bash
node scripts/catalog.mjs
```

Everywhere below, substitute the real values from [Project settings](#project-settings-edit-when-reusing-this-skill-in-another-project) before you show anything to the person. Never print a placeholder such as `<owner>` or `<repo>` in the chat: they have no way to resolve it, and a link they cannot click is the one thing that stops them publishing.

### If you can run git (Claude Code, most developer sessions)

Work in a clone at the working clone path from Project settings. Create it if it is not there:

```bash
git clone git@github.com:<library repository>.git ~/.claude/snotor-skills
```

If it is already there, pull first so you are not writing over someone else's change, then make your edit, then:

```bash
git -C ~/.claude/snotor-skills add -A
git -C ~/.claude/snotor-skills commit -m "<skill-name>: <what changed, in plain words>"
git -C ~/.claude/snotor-skills push
```

Never force-push. If the push is rejected because someone else pushed first, pull with rebase and push again; if that conflicts, the other person's change wins and you re-apply yours on top.

### If you cannot run git (Cowork, and anyone without a terminal)

Two routes. Try the first; fall back to the second without making it a discussion.

**With the GitHub connector.** If GitHub is connected (Customize, then Connectors), you can read the library and write to it directly, and the person approves the commit when you make it. This is the better route for improving an existing skill, because it is the only one where you can read the current text yourself. The connector is sometimes connected but exposes no tools; if you cannot actually list the repository, treat it as unavailable and move on rather than retrying.

**By browser link.** Show them the finished skill, then:

1. Give them the direct link, with the library repository filled in:
   - New skill: `https://github.com/<library repository>/new/main?filename=plugins/snotor-commands/skills/<name>/SKILL.md`
   - Existing skill: `https://github.com/<library repository>/edit/main/plugins/snotor-commands/skills/<name>/SKILL.md`
2. Tell them: paste the text I just gave you into the box, then press the green **Commit changes** button. That is it.

Put the full file content in the chat immediately above the link, in one code block, so it is a single copy. Do not split it across blocks. For an edit, give them the **whole file**, not just the changed part: the browser box holds the entire file, and a fragment pasted over it destroys the rest.

## Tell people what changed

After publishing, end with two short lines and nothing else:

- One sentence on what the skill now does differently, in the words the person used, not yours.
- How teammates get it: **nothing, it arrives on its own** when the library is distributed through organization settings. If it is not yet, they run `/plugin update snotor-commands` in Claude Code, or press Update on the marketplace in Cowork.

Do not summarize the interview, do not list the files you touched, and do not explain the publishing mechanism you used.

## Improve an existing skill

This is the common case and the one with the real risk in it. Creating a skill can only add something; changing a shared one can take away behaviour that other people were relying on, and nobody reviews it. The extra steps here exist for that.

### Get the current text

You cannot improve a file you have not read. In order of preference:

1. **From the clone on disk**, if you can run git. Pull first.
2. **Through the GitHub connector**, if it is connected. This is the route that makes improving a skill work in Cowork.
3. **From the person.** Send them the browser edit link for the skill, and ask them to copy what is in the box and paste it back to you. It is clumsy, so only use it when the first two are unavailable, and never guess at the file's contents instead.

Never reconstruct a skill from memory or from how it behaved. You will silently drop rules that someone added deliberately.

### Look at what changed recently

```bash
git -C ~/.claude/snotor-skills log --oneline -8 -- plugins/snotor-commands/skills/<name>/
```

If someone changed this skill recently, read that change before you touch the same area. The failure mode here is real and unpleasant: person A adds a rule on Monday, person B hits a case where that rule is inconvenient on Tuesday and removes it, and person A's problem quietly comes back. If your change would undo a recent deliberate one, say so and ask which behaviour they want, naming both.

### Read the whole file, not the relevant part

Most "the skill got this wrong" reports are caused by a rule elsewhere in the file contradicting the one you are about to add. Find the contradiction and resolve it, rather than stacking a second instruction on top and hoping the model picks yours.

### Sharpen rather than accumulate

A skill that grows a section every time someone is disappointed becomes a skill nobody reads, and a skill nobody reads stops being followed. Prefer, in this order:

1. **Make an existing rule specific.** Most of the time the instruction was right and too vague. "Keep it short" becomes "one sentence per ticket, no summary paragraph".
2. **Replace a rule that was wrong.**
3. **Add a rule**, only when the job genuinely has a step that is missing.

If the file has grown past what someone reads in one sitting, say so and offer to move the long reference material into a supporting file beside `SKILL.md`.

### Test it twice

The [test drive](#try-it-before-you-ship-it) is one run for a new skill. For a change to an existing one it is two, because you are checking two different things:

1. **The case that prompted the change.** Does it now come out right?
2. **A case the skill already handled well.** Does it still? Ask them for one, or take an obvious example of the skill's normal use. This is the regression check, and it is the only thing standing between a well-meant edit and quietly breaking the skill for everyone else.

If the second run comes out worse, the change is too broad. Narrow it to the case that actually failed and run both again.

### Say what changed, in the commit and to the team

Direct-to-main means your edit reaches everyone with no notification. Make the commit message a sentence a colleague can understand months later, not "update skill". Then tell the author to mention it wherever the team talks, in one line, if the change alters what people get rather than just tightening wording.

## Undo a change

Someone published something that made a skill worse. Fix it in one step and do not make them feel bad about it.

Show them the recent changes to that skill in plain language:

```bash
git -C ~/.claude/snotor-skills log --oneline -10 -- plugins/snotor-commands/skills/<name>/
```

Describe each one in a sentence and ask which state they want back. Then restore that version of the file, commit with a message saying what was reverted and why, and push. Do not rewrite history and do not force-push - the bad version stays in the log, which is fine.

If they cannot run git, point them at `https://github.com/<library repository>/commits/main/plugins/snotor-commands/skills/<name>/SKILL.md`, with the repository filled in, where the browser can show and restore any earlier version.

## Project settings (edit when reusing this skill in another project)

The rules above are project agnostic and reference the values here; reusing this skill elsewhere means editing this block, nothing else.

- **Library repository:** `shabat-snotor/claude-plugin` - update this when the library moves to the organization account.
- **Plugin name inside the repository:** `snotor-commands`, so skills live at `plugins/snotor-commands/skills/<name>/SKILL.md`.
- **Working clone path:** `~/.claude/snotor-skills`.
- **Branch:** `main`, direct push, no review.
- **Code host:** GitHub.
