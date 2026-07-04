# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this is

A GitHub **profile** repo (`thekaveh/thekaveh`) — its `README.md` is what renders at github.com/thekaveh. There is no application, no build, no tests, no dependencies. You edit hand-authored SVG + a thin markdown wrapper and verify by rendering.

This repo is one half of a **two-repo profile system**. Both repos present the *same* Tokyo Night "terminal session" profile — same hero, projects, skills (7 categories, 134 badges), and connect content — in two rendering environments:

| Repo | Path | Role | Tech |
|------|------|------|------|
| `thekaveh/thekaveh` (this) | `.` | GitHub profile README. **Constrained** by GitHub's HTML sanitizer. | `README.md` + pre-rendered SVG sections in `assets/` |
| `thekaveh.github.io` | `../thekaveh.github.io` (sibling, separate git repo) | The **primary**, unconstrained interactive version. Live at https://thekaveh.github.io | Single self-contained `index.html` (HTML + embedded CSS + small inline JS) |

**Content parity is the core invariant.** Any content change (rename a project, add/move a skill badge, edit the tagline or identity card) must land in **both** repos or they drift. The README's SVG sections deep-link into the Pages site (`https://thekaveh.github.io/#hero`, `#projects`, `#skills`, `#connect`).

## Why the README is SVG, not markdown

The README was originally inline markdown (shields.io badges + an HTML `<table>` of cards). It was rewritten to **pure SVG section images** because GitHub's HTML pipeline strips CSS and `<script>`, so the rich "cards inside a terminal chrome" design could not survive as markup, and table cards became unstyled clickable dead-ends. So `README.md` is now just `<picture>` elements wrapping per-section SVGs.

Hard constraints when touching SVGs that ship in the README:
- **No `<script>`** anywhere in an SVG — GitHub's camo image proxy strips it. Motion must be SMIL `<animate>` or CSS `@keyframes` inside an SVG `<style>` (these survive), and must degrade silently to a static image.
- Box-drawing/ASCII glyphs rendered as live text fail on GitHub's font stack — that's part of why content is baked into SVG paths/positioned text.

## Light / dark theming

`README.md` swaps SVGs by color scheme using `<picture><source media="(prefers-color-scheme: light)" …>`. Every section therefore has **two files**: `section-foo.svg` (Tokyo Night dark) and `section-foo-light.svg` (Tokyo Night Day). The light variant is the **same geometry with a swapped palette** — e.g. background `#0B0D13`→`#f4f5f9`, blue `#4A9EFF`→`#2e7de9`. When editing layout/text in one variant, mirror the identical edit into the other.

Asset set (all `viewBox` width 960, hand-authored XML):
- `profile-hero.svg` / `-light` — terminal chrome + block-art `KAVEH` + tagline + TS identity card + mission.
- `section-projects.svg` / `-light`
- `section-skills.svg` / `-light`
- `section-connect.svg` / `-light`

Note: the Pages `index.html` hero uses a rendered PNG (`assets/kaveh-hero.png`) for the block-art, whereas the README hero uses vector SVG text — same visual, different mechanism.

## Skills data — source of truth

In `index.html` the skills section is generated at runtime from a `const SKILLS = [...]` JS array near the bottom (icon, step #, title, slug, sub-sections of badge strings). That array is the canonical skills list. The README's `section-skills.svg` is the **hand-maintained mirror** of it — there is no generator linking them, so edits to skills must be applied to the array *and* re-drawn in both skills SVGs.

## Palette & design system

Tokyo Night. The hero block-art gradient is the per-row `LOGO_GRADIENT` from the `atlas` repo's `BlockLogo` Textual widget (top `#74A6F4` darkening down). Full palette table, typography stack (`JetBrains Mono`…), and the locked composition ("terminal frame, magazine inside") are documented in `docs/superpowers/specs/2026-06-03-readme-revamp-design.md`. The approved visual reference is the `q5-skill-expansion-v7` mockup under `.superpowers/brainstorm/.../content/` (gitignored).

## Working in this repo

- **`CLAUDE.md` and `AGENTS.md` are verbatim mirrors** (the latter for other agent harnesses like Codex) — everything below the opening guidance line must stay byte-identical between them. Any edit to one must be copied into the other, or they drift.
- **Verify visually.** This is design work with a person who checks every render — never claim an SVG edit landed without actually viewing the rendered result (open the SVG / the README preview / the Pages site).
- Match the approved mockup HTML/CSS source precisely rather than paraphrasing the design from memory.
- `docs/superpowers/` holds the design spec and implementation plan; `.superpowers/` and `.DS_Store` are gitignored.
- There are no commands to run — no lint, no test, no build.
