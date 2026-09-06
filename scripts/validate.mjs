#!/usr/bin/env node
// Checks every skill in the library before it reaches the team.
// Errors block publishing; warnings are printed and do not.
// Run with: node scripts/validate.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Every field Claude Code accepts in SKILL.md frontmatter.
const KNOWN_FIELDS = new Set([
  'name', 'description', 'when_to_use', 'argument-hint', 'arguments',
  'disable-model-invocation', 'user-invocable', 'allowed-tools',
  'disallowed-tools', 'model', 'effort', 'context', 'agent', 'background',
  'hooks', 'paths', 'shell', 'metadata', 'license', 'compatibility',
]);

// The six the Agent Skills spec allows. Only these survive a direct upload to
// claude.ai or the Skills API; plugin distribution accepts all of the above.
const SPEC_FIELDS = new Set([
  'name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools',
]);

// Plugin distribution accepts every field above, so the spec check is off unless
// someone is preparing a direct claude.ai upload: node scripts/validate.mjs --portable
const PORTABLE = process.argv.includes('--portable');

const DESC_CAP = 1536; // description + when_to_use, truncated past this in the skill listing.
const DESC_COMFORTABLE = 1000;

const PLAIN_STDOUT_ERROR = 8000;
const ALWAYS_ON_COMFORTABLE = 20000;
const ALWAYS_ON_START = '<!-- always-on:start -->';
const ALWAYS_ON_END = '<!-- always-on:end -->';

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

function splitFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { fields: null, body: raw, keys: [] };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fields: null, body: raw, keys: [] };
  return {
    fields: raw.slice(4, end + 1),
    body: raw.slice(raw.indexOf('\n', end + 1) + 1),
    keys: [],
  };
}

// Flat key/value parser. Skill frontmatter is a flat map, optionally with
// block lists and block scalars, which is all this needs to handle.
function parseFrontmatter(text) {
  const out = {};
  const lines = text.split('\n');
  let key = null;
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const top = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(line);
    if (top && !/^[ \t]/.test(line)) {
      key = top[1];
      let value = top[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
        (value.startsWith("'") && value.endsWith("'") && value.length > 1)
      ) {
        value = value.slice(1, -1);
      }
      out[key] = value;
    } else if (key && /^[ \t]/.test(line)) {
      out[key] = `${out[key] ? `${out[key]} ` : ''}${line.trim().replace(/^-\s*/, '')}`;
    }
  }
  return out;
}

function checkSkill(dir) {
  const where = relative(ROOT, dir);
  const file = join(dir, 'SKILL.md');
  if (!existsSync(file)) {
    err(where, 'has no SKILL.md');
    return;
  }
  const raw = readFileSync(file, 'utf8');
  const folder = dir.split('/').pop();

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(folder)) {
    err(where, `folder name "${folder}" must be lowercase words joined by hyphens`);
  }

  const { fields, body } = splitFrontmatter(raw);
  if (fields === null) {
    err(where, 'frontmatter must open with --- on the very first line and close with ---');
    return;
  }
  const fm = parseFrontmatter(fields);

  for (const k of Object.keys(fm)) {
    if (!KNOWN_FIELDS.has(k)) {
      err(where, `unknown frontmatter field "${k}"`);
    }
  }

  if (fm.name && fm.name !== folder) {
    err(where, `name "${fm.name}" does not match folder "${folder}"`);
  }
  if (!fm.name) warn(where, 'no name field; the folder name will be used');

  if (!fm.description || !fm.description.trim()) {
    err(where, 'description is required; it is the only text Claude sees when deciding to use the skill');
  } else {
    const combined = fm.description.length + (fm.when_to_use?.length ?? 0);
    if (combined > DESC_CAP) {
      err(where, `description + when_to_use is ${combined} characters, over the ${DESC_CAP} cap; it will be truncated in the skill listing`);
    } else if (combined > DESC_COMFORTABLE) {
      warn(where, `description + when_to_use is ${combined} characters; under ${DESC_COMFORTABLE} keeps it safe when the listing is crowded`);
    }
    const manualOnly = /^(true|yes|on|1)$/i.test(fm['disable-model-invocation'] ?? '');
    const hasTrigger = /\buse\s+(when|whenever|this|it|for|if)\b/i.test(fm.description) || fm.when_to_use;
    if (!manualOnly && !hasTrigger) {
      warn(where, 'description does not say when to use the skill, so Claude has little to trigger on');
    }
  }

  if (PORTABLE) {
    const nonSpec = Object.keys(fm).filter((k) => !SPEC_FIELDS.has(k));
    if (nonSpec.length) {
      warn(where, `uses ${nonSpec.join(', ')}, which a direct claude.ai upload rejects`);
    }
  }

  if (/(^|[ \t])!`/m.test(body) || /^```!/m.test(body)) {
    err(where, 'body uses inline shell injection, which is replaced with a placeholder in Cowork sessions and silently breaks the skill for non-developers');
  }

  if (/[—–]/.test(raw)) {
    err(where, 'contains an em-dash or en-dash; house style is a plain hyphen');
  }

  const secret = /(ghp_|gho_|github_pat_|glpat-|sk-ant-|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.exec(raw);
  if (secret) err(where, `looks like it contains a credential (${secret[1]})`);

  if (body.trim().length < 200) {
    warn(where, 'body is very short; a skill this thin usually belongs in the project instruction file instead');
  }

  checkAlwaysOnBlock(where, raw, dir);

  for (const ref of referenceFiles(dir)) {
    const refRaw = readFileSync(ref, 'utf8');
    const refWhere = relative(ROOT, ref);
    if (/[\u2014\u2013]/.test(refRaw)) {
      err(refWhere, 'contains an em-dash or en-dash; house style is a plain hyphen');
    }
    const refSecret = /(ghp_|gho_|github_pat_|glpat-|sk-ant-|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.exec(refRaw);
    if (refSecret) err(refWhere, `looks like it contains a credential (${refSecret[1]})`);
  }
}

function referenceFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.md') && full !== join(dir, 'SKILL.md')) out.push(full);
    }
  };
  walk(dir);
  return out;
}

function checkAlwaysOnBlock(where, raw, dir) {
  const start = raw.indexOf(ALWAYS_ON_START);
  const end = raw.indexOf(ALWAYS_ON_END);
  if (start === -1 && end === -1) return;
  if (start === -1 || end === -1) {
    err(where, `has only one always-on marker; the hook needs both ${ALWAYS_ON_START} and ${ALWAYS_ON_END}`);
    return;
  }
  if (end < start) {
    err(where, 'always-on end marker comes before the start marker');
    return;
  }
  const size = raw.slice(start + ALWAYS_ON_START.length, end).length;
  const json = hookEmitsJson(join(dir, '..', '..', 'hooks'));
  if (!json && size > PLAIN_STDOUT_ERROR) {
    err(where, `always-on block is ${size} characters and no hook emits it as hookSpecificOutput.additionalContext; Claude Code truncates oversized plain hook stdout to a 2KB preview and saves the rest to a file, silently dropping most of the writing style. Emit JSON, or keep the block under ${PLAIN_STDOUT_ERROR} characters`);
  } else if (size > ALWAYS_ON_COMFORTABLE) {
    warn(where, `always-on block is ${size} characters, which every session pays for; roughly ${Math.ceil(size / 4)} tokens`);
  }
}

function hookEmitsJson(hooksDir) {
  if (!existsSync(hooksDir)) return false;
  return readdirSync(hooksDir).some((f) => {
    const full = join(hooksDir, f);
    if (!statSync(full).isFile()) return false;
    return readFileSync(full, 'utf8').includes('hookSpecificOutput');
  });
}

function checkJson(file, label) {
  if (!existsSync(file)) {
    err(label, 'is missing');
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    err(label, `is not valid JSON: ${e.message}`);
    return null;
  }
}

checkJson(join(ROOT, '.claude-plugin/marketplace.json'), '.claude-plugin/marketplace.json');

const pluginsDir = join(ROOT, 'plugins');
const plugins = existsSync(pluginsDir)
  ? readdirSync(pluginsDir).filter((d) => statSync(join(pluginsDir, d)).isDirectory())
  : [];
if (!plugins.length) err('plugins/', 'contains no plugin');

let count = 0;
for (const plugin of plugins) {
  checkJson(join(pluginsDir, plugin, '.claude-plugin/plugin.json'), `plugins/${plugin}/.claude-plugin/plugin.json`);
  const skillsDir = join(pluginsDir, plugin, 'skills');
  if (!existsSync(skillsDir)) continue;
  const names = new Set();
  for (const d of readdirSync(skillsDir)) {
    const dir = join(skillsDir, d);
    if (!statSync(dir).isDirectory()) continue;
    const key = d.toLowerCase();
    if (names.has(key)) err(`plugins/${plugin}/skills`, `two skills named "${key}" differing only by case`);
    names.add(key);
    checkSkill(dir);
    count++;
  }
}

for (const w of warnings) console.log(`warning  ${w}`);
for (const e of errors) console.log(`ERROR    ${e}`);
console.log(
  `\n${count} skill${count === 1 ? '' : 's'} checked, ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`,
);
process.exit(errors.length ? 1 : 0);
