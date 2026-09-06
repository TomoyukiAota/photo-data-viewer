# CLAUDE.md

What this app does and how to work on it is in [`README.md`](README.md) and
[`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md). This file holds only what is
needed at the start of a session.

## Write in English

This repository is written in English — code, comments, `README.md`, docs, commit
messages, branch names, pull request titles and descriptions, and this file.
Keep it that way.

## Knowledge about this repo lives in this repo

Do not use Claude's memory (`~/.claude/projects/…/memory/`) as the place to keep
knowledge about this repository. Memory is **per clone and per machine**, so it
does not travel: work on another computer and it is simply not there. That has
already happened.

Put it in the repository instead — `README.md`, `docs/`, this file, or a comment
next to the code it explains. Git carries it to every clone and every machine,
and a pull request makes it reviewable.

This is not a promise to remember: [`.claude/settings.json`](.claude/settings.json)
sets `"autoMemoryEnabled": false`, which turns memory off entirely (both reading
and writing). That file is tracked, so the switch travels with the repository.

Working in a directory that is **not** under git is the exception — there, memory
is the only place available, so use it.

## This repository is public

`TomoyukiAota/photo-data-viewer` is a **public** repository. Everything that lands
here is readable by anyone: pull request titles and descriptions, issues, **commit
messages**, branch names, and comments in the code.

**Do not write private things here** — names of private repositories, third-party
services used privately, personal photos. When such a source is needed, carry over
**the content only**, without naming where it came from. When in doubt, leave it
out and ask.
