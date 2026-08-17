# Profile CV Sync Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the public profile concise while making its positioning, project cards, and skills taxonomy faithfully reflect the canonical CV, with the `.io` HTML remaining the source for generated README SVGs.

**Architecture:** Update `/Users/kaveh/repos/thekaveh.github.io/index.html` first. Keep seven visual skill cards, but render the CV's sixteen exact skill categories as nested sub-sections with deduplicated canonical entries. Regenerate the README's dark/light section SVGs from the HTML source, then verify HTML/SVG content and visual parity.

**Tech Stack:** Self-contained HTML/CSS/JS, browser-rendered section snapshots, generated SVG assets, Node.js verification scripts, Playwright, `xmllint`, and `rsvg-convert`.

## Global Constraints

- Work only on `codex/profile-cv-sync-overhaul` in both repositories; do not merge or push to `main`.
- The canonical CV source is `/Users/kaveh/repos/CV/content/cv.yml`.
- The public profile remains a concise portfolio; do not add full experience, certifications, publications, phone number, or location.
- Use the exact CV positioning: `Lead Staff Software Engineer | Data Platforms, ML Systems & GenAI`.
- Use `20+ years` and `12 years at Comscore`; remove all `15+ years` wording.
- Use canonical CV project names, blurbs, technology lists, and links; specifically correct `rag-showcase` and `VMx` claims.
- Keep the existing Tokyo Night palette, JetBrains Mono typography, terminal frame, block-art, motion, and responsive behavior.
- Remove visible implementation boilerplate such as `BLOCKLOGO · LOGO_GRADIENT` and the verbose render command while retaining useful terminal navigation prompts.
- Regenerate all README SVG sections from the updated `.io` HTML; never hand-edit generated SVG payloads.
- Preserve unrelated pre-existing untracked files.

## Files

- Modify: `/Users/kaveh/repos/thekaveh.github.io/index.html` — canonical profile content, project cards, skill data, and visible boilerplate.
- Modify: `/Users/kaveh/repos/thekaveh/README.md` — wrapper navigation order only if needed after HTML parity review.
- Regenerate: `/Users/kaveh/repos/thekaveh/assets/generated-from-io.json` and all generated dark/light section SVGs.
- Modify: `/Users/kaveh/repos/thekaveh/docs/superpowers/plans/2026-08-16-profile-cv-sync-overhaul.md` — this implementation record.

### Task 1: Lock the canonical content contract

- [ ] Add a failing content assertion against the current HTML for the exact title, `20+ years`, `12 years at Comscore`, corrected `rag-showcase`, corrected `VMx`, and absence of the obsolete boilerplate string.
- [ ] Run the assertion and confirm it fails against the current branch.
- [ ] Update the hero metadata, identity text, project descriptions, and visible chrome in `index.html`.
- [ ] Run the assertion and confirm it passes.

### Task 2: Replace the skill data model

- [ ] Add a failing data assertion requiring 7 visual groups, 16 exact CV category labels, 174 unique canonical CV skills, and zero profile-only entries.
- [ ] Run the assertion and confirm it fails against the current 227-badge model.
- [ ] Replace `SKILLS` with seven visual groups containing the exact CV category names and deduplicated CV entries.
- [ ] Keep the renderer's existing badge styling, counts, prompts, reveal behavior, and responsive structure.
- [ ] Run the assertion and confirm it passes.

### Task 3: Regenerate and verify README SVGs

- [ ] Run `generate-readme-svgs-from-io.mjs` from the README repository using the bundled Node runtime.
- [ ] Run `verify-readme-svgs-from-io.mjs` and require zero mismatches for all dark/light sections.
- [ ] Validate every SVG with `xmllint --noout` and render representative dark/light assets with `rsvg-convert`.
- [ ] Verify granular links still target `#hero`, `#projects`, `#skills`, `#connect`, repository URLs, documentation URLs, and connect URLs.
- [ ] Update the README footer order to match HTML: Email, GitHub, LinkedIn.

### Task 4: Browser and repository verification

- [ ] Render the updated HTML at desktop and mobile widths with Playwright.
- [ ] Check zero horizontal overflow, complete card text visibility, 7 visual skill groups, 16 CV sub-sections, and 174 unique badges.
- [ ] Inspect screenshots for visual regressions and boilerplate remnants.
- [ ] Run `git diff --check` in both repositories and review the complete diff.
- [ ] Commit the `.io` change first and the generated README change second on the feature branches only.

