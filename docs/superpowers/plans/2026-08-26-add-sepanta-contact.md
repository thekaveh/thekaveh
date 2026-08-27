# Sepanta Contact Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `https://sepanta.ai/` as a first-class contact card in the primary HTML profile and faithfully regenerate the GitHub SVG mirror.

**Architecture:** The `.io` `index.html` remains the source of truth for connect-card markup, ordering, responsive layout, and labels. The existing SVG generator will rasterize the updated `#connect` section and update the dark/light assets plus manifest; `README.md` will only receive the matching reach-out ordering and stale badge-count correction.

**Tech Stack:** Hand-authored HTML/CSS/inline SVG, Node.js verification scripts, Playwright-backed SVG generator, `xmllint`/`rsvg-convert` for asset checks.

## Global Constraints

- Keep the existing Tokyo Night palette, JetBrains Mono typography, card effects, icon-before-label convention, and responsive behavior.
- Use the exact website URL `https://sepanta.ai/`.
- Keep contact ordering identical everywhere: Email, Sepanta, GitHub, LinkedIn.
- Generate the SVG mirror from `/Users/kaveh/repos/thekaveh.github.io/index.html`; do not hand-author divergent SVG content.
- Do not modify the CV repository or the pre-existing untracked `docs/mockups/` content.
- Keep `main` untouched until the feature branches are reviewed and explicitly merged.

### Task 1: Add the Sepanta card and source-of-truth ordering

**Files:**
- Modify: `/Users/kaveh/repos/thekaveh.github.io/index.html`
- Test: `/Users/kaveh/repos/thekaveh.github.io/scripts/verify-profile-cv-sync.mjs`

**Interfaces:**
- Consumes: existing `.connect-grid`, `.service`, `.service-icon`, and contact-card styling.
- Produces: a four-card connect section with the Sepanta card between Email and GitHub, plus matching HTML reach-out order.

- [x] Add a failing contract assertion for the exact URL, label, and order.
- [x] Run `node scripts/verify-profile-cv-sync.mjs` and confirm it fails because Sepanta is absent.
- [x] Add the Sepanta card with the existing service markup and a globe icon, and adjust the desktop grid to four columns while retaining the mobile one-column layout.
- [x] Update the HTML reach-out row to `Email · Sepanta · GitHub · LinkedIn`.
- [x] Run `node scripts/verify-profile-cv-sync.mjs` and confirm it passes.

### Task 2: Regenerate and verify the GitHub SVG mirror

**Files:**
- Modify: `/Users/kaveh/repos/thekaveh/README.md`
- Modify: `/Users/kaveh/repos/thekaveh/assets/generated-from-io.json`
- Modify: `/Users/kaveh/repos/thekaveh/assets/profile-hero.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/profile-hero-light.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-projects.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-projects-light.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-skills.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-skills-light.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-connect.svg`
- Modify: `/Users/kaveh/repos/thekaveh/assets/section-connect-light.svg`

**Interfaces:**
- Consumes: the updated HTML source and `scripts/generate-readme-svgs-from-io.mjs`.
- Produces: SVG assets whose connect section contains the same four cards and whose links target `https://thekaveh.github.io/#connect`.

- [x] Run the existing generator with the bundled Node runtime.
- [x] Update the README reach-out row to `Email · Sepanta · GitHub · LinkedIn` and correct its alt text from 227 to 174 badges.
- [x] Run `scripts/verify-readme-svgs-from-io.mjs` and require zero mismatches for all dark/light sections.
- [x] Run `xmllint --noout` on all generated SVGs and rasterize the connect assets with `rsvg-convert` for visual inspection.

### Task 3: Commit and publish the reversible review branches

**Files:**
- Git history only; no additional source files.

- [x] Run `git diff --check` and confirm only the planned files changed.
- [x] Commit the `.io` source changes on `codex/add-sepanta-contact`.
- [x] Commit the generated README/SVG mirror on `codex/add-sepanta-contact`.
- [ ] Push both feature branches without merging into `main`.
