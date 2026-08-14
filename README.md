# Snotor command plugin

Snotor's shared AI workflow commands, packaged for one-line installation and central updates. The commands are project agnostic: best practices in each body, project specifics (platform tags, tracker key, code host, accessibility requirements) in a labeled Project settings block inside the skill.

Contents of this repository: the plugin itself under `plugins/snotor-commands/`, and `scripts/package.sh`, which builds upload archives on demand into a git-ignored `build/` directory. No built archives are committed, because a committed archive silently goes stale the first time a command changes.

What is inside: `/jira-ticket` (tickets in the team's formats, with parent lookup and a duplicate check), `/doc-review` (design-document review verified against the code), and the six workflow starters (`/work-on`, `/investigate`, `/interview`, `/explain-diff`, `/write-sql`, `/feature-doc`). The Team command library page on the team's internal wiki documents when each is used.

## This repository is public

Public on purpose: a public marketplace needs no GitHub access, so Claude Code, Cowork, and any teammate install and update without credentials or an administrator. That only stays safe if the contents stay publishable, so one rule governs every change here: **command bodies carry best practices, never project secrets.** Nothing that would matter if a stranger read it - no internal URLs or hostnames, no scale or traffic numbers, no architecture decisions or incident details, no credentials, and no personal data. Anything project-sensitive belongs in the project's own instruction file, which the commands read at runtime and which is not part of this repository.

The one deliberate exception is the Project settings block at the bottom of each skill, which names the adopting team's tracker key, platform tags, code host, and accessibility obligation. Those are conventions, not secrets.

Another team adopting these commands should fork this repository and edit the Project settings block in the fork, rather than editing the installed files: installed plugins are overwritten by updates, and Cowork warns before doing so.

## Install in Claude Code (recommended)

Type these in any Claude Code session:

```
/plugin marketplace add shabat-snotor/claude-plugin
/plugin install snotor-commands@snotor
```

Plugin commands are namespaced, so they appear as `/snotor-commands:jira-ticket`, `/snotor-commands:work-on`, and so on. Updates are automatic in spirit and one command in practice: the plugin is versioned by commit (no `version` field on purpose, the recommended setup for team plugins under active development), so every merge to this repository is a new version, picked up by auto-update or by `/plugin update`.

To onboard developers with zero instructions, add the marketplace to a shared repository's `.claude/settings.json` (for example a service repository everyone clones); anyone who trusts that folder is prompted to install automatically:

```json
{
  "extraKnownMarketplaces": {
    "snotor": {
      "source": { "source": "github", "repo": "shabat-snotor/claude-plugin" }
    }
  },
  "enabledPlugins": { "snotor-commands@snotor": true }
}
```

## Install without the plugin

Copy `skills/` and `commands/` from `plugins/snotor-commands/` into your project's `.claude/` folder, or into `~/.claude/` for personal use. A skill file must stay inside its folder (`skills/write-sql/SKILL.md`); the folder name is the command name, and this layout keeps the short unprefixed names (`/write-sql`).

## Install in Cowork

Two ways, and the file upload is the one that always works.

**From a file (no repository access needed).** On the Plugins page under Customize, run `scripts/package.sh` (or ask a developer to), then choose the upload option and select `build/snotor-commands-plugin.zip`. Everything installs in one step. The cost is that updates are manual: re-download and re-upload the zip when the commands change.

**From this repository (updates on a button).** On the Plugins page select Add marketplace and enter `shabat-snotor/claude-plugin` (the plain owner/repo shorthand works), then install `snotor-commands` and press Update on the marketplace whenever you want the latest. Because this repository is public, Cowork reaches it without any GitHub connection, which is the reason it is public.

## Install on claude.ai

The chat product does not use plugins at all and does not read `.claude` folders; run `scripts/package.sh` and upload the archives from `build/claude-ai-skills/` through Settings and its Skills section, one per command you want. The zips are the same skills with the `argument-hint` line already removed, since that field is rejected on upload; `doc-review.zip` is the command re-wrapped as a skill for the same reason.

## Organization-wide distribution (the end state)

On a Team or Enterprise plan, an organization owner can distribute this plugin to the whole organization from the admin plugin settings: connect this repository as a marketplace (it syncs automatically when changes merge, through the Claude GitHub App) or upload the plugin as a zip, then set the installation preference. Marking it "Installed by default" gives everyone on claude.ai and Cowork the commands with no setup at all, which supersedes the per-person install paths above for non-developers. Requires Cowork and Skills enabled on the plan; only organization owners can manage the catalog.

## Changing a command

This repository is the source of truth once it is live: change a command here through a pull request and merge. That is the entire release process; the merge itself is the new version, and everyone receives it through auto-update, `/plugin update`, or Cowork's Update button on the marketplace. The team's internal Team command library page stays as documentation of what the commands do.
