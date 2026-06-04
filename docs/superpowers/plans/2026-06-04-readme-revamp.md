# README Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current GitHub profile README at `thekaveh/thekaveh` with a Tokyo-Night-themed, terminal-framed page featuring a GenAI-Vanilla LOGO_GRADIENT block-art SVG hero (with subtle declarative animations), a TS-object identity card, a "Projects" grid (5 repos, 3 + 2 layout), a 7-category skill inventory (~129 badges), and a Connect block.

**Architecture:** Single Markdown rewrite + one new self-contained animated SVG hero asset. All UI is rendered by GitHub's native Markdown engine. Badges use `img.shields.io`; project / connect grids use plain HTML `<table>` / `<div>` blocks that pass GitHub's sanitizer. Animations live inside the SVG as embedded CSS `@keyframes` — declarative only, no `<script>` (so GitHub's image proxy doesn't strip them).

**Tech Stack:** Markdown · HTML tables · `img.shields.io` badges · SVG (with embedded `<style>` and CSS animations). No build system, no JS, no third-party widgets, no dependencies.

**Spec source of truth:** `docs/superpowers/specs/2026-06-03-readme-revamp-design.md`

---

## File Structure

| Action  | Path                          | Responsibility                                                                                |
|---------|-------------------------------|-----------------------------------------------------------------------------------------------|
| Create  | `assets/profile-hero.svg`     | Animated block-art hero — owns the rendered "KAVEH" + tagline visual.                          |
| Modify  | `README.md`                   | Page content — composes the SVG, identity card, mission, projects, skills, connect, footer.     |
| Delete  | `assets/profile-terminal.svg` | Superseded by `profile-hero.svg`. Removed in the final cleanup task.                            |

`README.md` is rewritten section by section; one commit per section so each commit produces an inspectable rendered page.

## Verification approach

This is a presentation feature — there are no unit tests. Each task ends with a **render check**:

- **SVG tasks:** open in a browser → confirm the animations play and the colors match.
- **Markdown tasks:** preview locally (VS Code's Markdown Preview, GitHub's "Open in browser preview" extension, or `gh markdown-preview` if installed) and after the final task, push the branch and verify on `github.com/kavehrazavi`.

The final task (Task 16) runs the full 7-item acceptance checklist from spec §6.

## Working tree precondition

The current `README.md` has an uncommitted draft that already includes most section scaffolding (hero `<img>`, TS identity card, mission console, the OLD 5-category skill clusters, connect block, footer comment). This plan **builds on top of that draft**, replacing one section at a time. No stash needed.

```bash
# Confirm starting state before Task 1:
git status --short
# Expected:
#  M README.md
# ?? assets/
```

---

## Task 1: Create the animated `profile-hero.svg`

**Files:**
- Create: `assets/profile-hero.svg`

The existing `assets/profile-terminal.svg` is a static SVG matching the spec's geometry. The new file diverges in three ways:

1. Row 4 block-art color is `#B4F9F8` (brightest glacier highlight) — was `#7DCFFF`.
2. Row 6 block-art color is `#7DCFFF` — was `#4A9EFF`.
3. Tagline middle text is `ML/AI Researcher & Engineer` — was `Machine Learning Engineer`.
4. Adds a `█` cursor at the end of the prompt line that blinks via CSS `@keyframes`.
5. Adds CSS `@keyframes` that breathes the block-art glow filter `stdDeviation` between 1.2 and 2.0.

- [ ] **Step 1.1: Write `assets/profile-hero.svg` with the full content below**

```svg
<svg width="960" height="420" viewBox="0 0 960 420" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Kaveh terminal profile hero</title>
  <desc id="desc">A dark terminal-style GitHub profile hero. The block-art logo reads Kaveh and uses the GenAI Vanilla LOGO_GRADIENT palette: #4a9eff, #7dcfff, #a8d4e6, #b4f9f8. Subtle CSS animations: breathing glow on the letters and a blinking cursor on the prompt line.</desc>

  <defs>
    <radialGradient id="ambientBlue" cx="18%" cy="12%" r="74%">
      <stop offset="0%" stop-color="#4A9EFF" stop-opacity="0.20"/>
      <stop offset="48%" stop-color="#0B0D13" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ambientCyan" cx="82%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#7DCFFF" stop-opacity="0.14"/>
      <stop offset="58%" stop-color="#0B0D13" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="frameStroke" x1="46" y1="42" x2="914" y2="378" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4A9EFF" stop-opacity="0.88"/>
      <stop offset="35%" stop-color="#7DCFFF" stop-opacity="0.78"/>
      <stop offset="70%" stop-color="#A8D4E6" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#7DCFFF" stop-opacity="0.50"/>
    </linearGradient>
    <linearGradient id="terminalTop" x1="47" y1="43" x2="913" y2="43" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#11131D"/>
      <stop offset="55%" stop-color="#1A1E30"/>
      <stop offset="100%" stop-color="#11131D"/>
    </linearGradient>
    <filter id="rowGlow" x="-8%" y="-35%" width="116%" height="170%">
      <feGaussianBlur stdDeviation="1.4" result="blur">
        <animate attributeName="stdDeviation" values="1.2;2.0;1.2" dur="5s" repeatCount="indefinite"/>
      </feGaussianBlur>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style>
      .mono { font-family: 'JetBrains Mono', 'SFMono-Regular', 'Cascadia Code', 'Menlo', 'Consolas', monospace; }
      .tiny { font-family: 'JetBrains Mono', 'SFMono-Regular', 'Cascadia Code', 'Menlo', 'Consolas', monospace; font-size: 12px; letter-spacing: 0.04em; }
      .prompt { font-family: 'JetBrains Mono', 'SFMono-Regular', 'Cascadia Code', 'Menlo', 'Consolas', monospace; font-size: 15px; letter-spacing: 0.05em; }
      .logo { font-family: 'JetBrains Mono', 'SFMono-Regular', 'Cascadia Code', 'Menlo', 'Consolas', monospace; font-size: 28px; font-weight: 800; letter-spacing: -1.25px; }
      .cursor { animation: blink 1.1s steps(1) infinite; }
      @keyframes blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
      .row-glow-css { animation: glowBreath 5s ease-in-out infinite; }
      @keyframes glowBreath { 0%, 100% { filter: drop-shadow(0 0 1.2px currentColor); } 50% { filter: drop-shadow(0 0 2.0px currentColor); } }
    </style>
  </defs>

  <rect width="960" height="420" rx="26" fill="#0B0D13"/>
  <rect width="960" height="420" rx="26" fill="url(#ambientBlue)"/>
  <rect width="960" height="420" rx="26" fill="url(#ambientCyan)"/>

  <g opacity="0.22">
    <path d="M70 330H890" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="4 12"/>
    <path d="M70 288H890" stroke="#414868" stroke-width="1" stroke-dasharray="2 14"/>
    <path d="M70 132H890" stroke="#414868" stroke-width="1" stroke-dasharray="2 14"/>
    <path d="M142 70V360" stroke="#414868" stroke-width="1" stroke-dasharray="3 16"/>
    <path d="M818 70V360" stroke="#414868" stroke-width="1" stroke-dasharray="3 16"/>
  </g>

  <rect x="46" y="42" width="868" height="336" rx="18" fill="#0E0F18" stroke="url(#frameStroke)" stroke-width="1.4"/>
  <rect x="47" y="43" width="866" height="54" rx="17" fill="url(#terminalTop)"/>
  <path d="M47 97H913" stroke="#2B2F4A" stroke-width="1"/>

  <circle cx="78" cy="70" r="7" fill="#F7768E"/>
  <circle cx="102" cy="70" r="7" fill="#E0AF68"/>
  <circle cx="126" cy="70" r="7" fill="#98C379"/>

  <text x="154" y="75" class="tiny" fill="#565F89">kaveh@github:~/profile</text>
  <text x="735" y="75" class="tiny" fill="#7DCFFF">BLOCKLOGO · LOGO_GRADIENT</text>

  <text x="82" y="132" class="prompt" fill="#7DCFFF">$ render_name --text KAVEH --style block-logo --gradient logo<tspan class="cursor" dx="6" fill="#B4F9F8">█</tspan></text>

  <g class="logo" filter="url(#rowGlow)">
    <text x="78" y="184" fill="#4A9EFF">██╗  ██╗ █████╗ ██╗   ██╗███████╗██╗  ██╗</text>
    <text x="78" y="222" fill="#7DCFFF">██║ ██╔╝██╔══██╗██║   ██║██╔════╝██║  ██║</text>
    <text x="78" y="260" fill="#A8D4E6">█████╔╝ ███████║██║   ██║█████╗  ███████║</text>
    <text x="78" y="298" fill="#B4F9F8">██╔═██╗ ██╔══██║╚██╗ ██╔╝██╔══╝  ██╔══██║</text>
    <text x="78" y="336" fill="#A8D4E6">██║  ██╗██║  ██║ ╚████╔╝ ███████╗██║  ██║</text>
    <text x="78" y="374" fill="#7DCFFF">╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝</text>
  </g>

  <rect x="78" y="390" width="804" height="1" fill="#2B2F4A" opacity="0.8"/>
  <text x="78" y="409" class="tiny" fill="#7DCFFF">Lead Staff Software Engineer</text>
  <text x="286" y="409" class="tiny" fill="#565F89">→</text>
  <text x="310" y="409" class="tiny" fill="#A8D4E6">ML/AI Researcher &amp; Engineer</text>
  <text x="540" y="409" class="tiny" fill="#565F89">//</text>
  <text x="568" y="409" class="tiny" fill="#7DCFFF">GenAI · Distributed Systems · Automation</text>
</svg>
```

- [ ] **Step 1.2: Open the SVG in a browser and verify the render**

Run: `open assets/profile-hero.svg`

Expected:
- Dark terminal-window frame with three traffic-light dots in red/yellow/green.
- 6-row block-art "KAVEH" with row colors top to bottom: blue (`#4A9EFF`) → cyan (`#7DCFFF`) → glacier (`#A8D4E6`) → **bright glacier highlight (`#B4F9F8`)** → glacier → cyan.
- Prompt line `$ render_name --text KAVEH --style block-logo --gradient logo` followed by a `█` block cursor that blinks every ~1.1s.
- Block-art letters show a subtle glow that breathes (gets brighter / dimmer) over a 5-second cycle.
- Bottom tagline reads `Lead Staff Software Engineer → ML/AI Researcher & Engineer // GenAI · Distributed Systems · Automation`.

If any of those are wrong, fix in place before committing.

- [ ] **Step 1.3: Commit**

```bash
git add assets/profile-hero.svg
git commit -m "$(cat <<'EOF'
feat: add animated profile hero SVG

Adds assets/profile-hero.svg: KAVEH block-art with per-row
LOGO_GRADIENT colors (row 4 brightened to #B4F9F8), tagline
ending in 'ML/AI Researcher & Engineer', and two declarative
animations: breathing glow on the letters and a blinking cursor
on the prompt line. All animations are SMIL/CSS keyframes so
GitHub's image proxy passes them through.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Point README hero `<img>` at the new SVG

**Files:**
- Modify: `README.md` (line 2)

- [ ] **Step 2.1: Update the hero `<img src>` to point at `assets/profile-hero.svg`**

In `README.md`, replace:

```html
  <img src="./assets/profile-terminal.svg" alt="Kaveh — terminal profile hero" width="100%" />
```

With:

```html
  <img src="./assets/profile-hero.svg" alt="Kaveh — Tokyo Night terminal profile hero" width="100%" />
```

- [ ] **Step 2.2: Render-check**

Open `README.md` in your Markdown previewer. The hero should now display the new animated SVG (animation may not play in all previewers but the static art should be correct).

- [ ] **Step 2.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): point hero img at profile-hero.svg

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Update the identity TS object

**Files:**
- Modify: `README.md` (the `const kaveh = { ... }` code block, lines 7-23 in the working draft)

Per spec §4.2 — only the `trajectory` line changes. The rest is already correct.

- [ ] **Step 3.1: Update the `trajectory` line**

In `README.md`, replace:

```
  trajectory: "Software Engineering → Machine Learning Engineering",
```

With:

```
  trajectory: "Software Engineering → ML/AI Research & Engineering",
```

- [ ] **Step 3.2: Render-check**

Reload your Markdown preview; confirm the TS code block highlights and the trajectory line reads `"Software Engineering → ML/AI Research & Engineering"`.

- [ ] **Step 3.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): update identity trajectory to ML/AI Research & Engineering

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Verify and lock the Mission section

**Files:**
- Inspect: `README.md` (the `kaveh@github:~$ ./mission --current` block)

Per spec §4.3 — the current draft mission line already matches the spec verbatim. This task is a verification-only checkpoint; no commit unless something is off.

- [ ] **Step 4.1: Confirm the mission block reads exactly as below**

```
kaveh@github:~$ ./mission --current
> Building scalable systems that turn data, models, and automation into practical leverage.
```

If it matches, move to Task 5 with no commit. If it doesn't, edit to match, render-check, then commit with message `feat(readme): align mission line with spec`.

---

## Task 5: Insert the Projects section

**Files:**
- Modify: `README.md` (insert a new section between the Mission console block and the existing Skills heading `## ▸ Systems I Work With`)

Per spec §4.4 — five featured projects in a 3 + 2 HTML table layout (5 cells, last cell empty).

- [ ] **Step 5.1: Insert the Projects section just before the existing `## ▸ Systems I Work With` heading**

Add this block immediately after the mission `console` code fence and before the next `---` divider:

````markdown
---

## ▸ Projects

```console
kaveh@github:~$ ls ~/projects/
```

<table>
  <tr>
    <td valign="top" width="33%">
      <h4>▸ <a href="https://github.com/thekaveh/genai-vanilla">genai-vanilla</a></h4>
      <sub>Modular GenAI stack with a Textual TUI bootstrapper — orchestrates 30+ services.</sub>
    </td>
    <td valign="top" width="33%">
      <h4>▸ <a href="https://github.com/thekaveh/GuideArch">GuideArch</a></h4>
      <sub>Fuzzy TOPSIS architecture-decision tool — three concurrent implementations sharing one spec.</sub>
    </td>
    <td valign="top" width="33%">
      <h4>▸ <a href="https://github.com/thekaveh/NNx">NNx</a></h4>
      <sub>PyTorch training / eval / visualization toolkit with first-class GNN support.</sub>
    </td>
  </tr>
  <tr>
    <td valign="top" width="33%">
      <h4>▸ <a href="https://github.com/thekaveh/VMx">VMx</a></h4>
      <sub>Lifecycle-aware MVVM framework — one spec, four language flavors (C# · Python · TypeScript · Swift), 232 conformance tests.</sub>
    </td>
    <td valign="top" width="33%">
      <h4>▸ <a href="https://github.com/thekaveh/ml-lab">ml-lab</a></h4>
      <sub>Personal ML lab — portfolio of self-contained <code>[task]-[dataset]-[model]-[framework]</code> experiments built on <code>nnx</code>.</sub>
    </td>
    <td valign="top" width="33%">&nbsp;</td>
  </tr>
</table>
````

- [ ] **Step 5.2: Render-check**

Reload your Markdown preview. Confirm:
- Section heading "▸ Projects" appears.
- A `$ ls ~/projects/` console line above the grid.
- Two rows: row 1 has genai-vanilla / GuideArch / NNx; row 2 has VMx / ml-lab / (empty cell).
- All five project names are clickable links pointing at the correct repos.

- [ ] **Step 5.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add Projects section with 5 featured repos

3 + 2 HTML table layout per spec §4.4: genai-vanilla, GuideArch,
NNx in row 1; VMx, ml-lab in row 2.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Rewrite Skills section header + Category 01 (Languages & Editors)

**Files:**
- Modify: `README.md` (rename the existing `## ▸ Systems I Work With` heading to `## ▸ Skills`, and replace the first sub-section with Languages & Editors)

From this task through Task 12, we replace the OLD 5-category skill structure with the NEW 7-category one. Each task does ONE category and commits, so each commit produces a renderable midpoint.

- [ ] **Step 6.1: Rename the Skills section heading**

Replace:

```markdown
## ▸ Systems I Work With
```

With:

```markdown
## ▸ Skills
```

- [ ] **Step 6.2: Replace the first existing category sub-block (`### 🧠 Machine Learning & GenAI` + its `<p>...</p>` badge cluster) with the new Languages & Editors block**

Replace the entire block:

```markdown
### 🧠 Machine Learning & GenAI
<p>
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-000000?style=flat-square&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI_API-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-000000?style=flat-square&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/CrewAI-000000?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch_Geometric-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/DSPy-FF9E64?style=flat-square&logo=python&logoColor=white" />
</p>
```

With the new Category 01 block:

````markdown
### 🔨 01 · Languages & Editors

```console
kaveh@github:~$ cat ~/skills/languages-editors.md
```

<sub>▸ Languages</sub>
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Scala-DC322F?style=flat-square&logo=scala&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-239120?style=flat-square&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Objective--C-000000?style=flat-square&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/ActionScript-FF6600?style=flat-square&logo=adobe&logoColor=white" />
</p>

<sub>▸ Editors</sub>
<p>
  <img src="https://img.shields.io/badge/Visual_Studio-5C2D91?style=flat-square&logo=visualstudio&logoColor=white" />
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" />
  <img src="https://img.shields.io/badge/IntelliJ_IDEA-000000?style=flat-square&logo=intellijidea&logoColor=white" />
  <img src="https://img.shields.io/badge/XCode-1575F9?style=flat-square&logo=xcode&logoColor=white" />
</p>
````

**Note:** because the inner block uses triple-backtick fences for the console line, when you write this section inside the README you must indent or escape the fences. The cleanest way is to write the section content **outside** any wrapping fence — the section above is what appears in the file directly, not inside another code block.

- [ ] **Step 6.3: Render-check**

Confirm:
- Section heading "▸ Skills" appears (no longer "Systems I Work With").
- First sub-category is "🔨 01 · Languages & Editors".
- Two `▸ Languages` and `▸ Editors` mini-headers with their badge rows.
- 9 language badges, 4 editor badges, all rendering with brand colors.

- [ ] **Step 6.4: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): rename to Skills + add category 01 Languages & Editors

Renames the section from 'Systems I Work With' to 'Skills', and
replaces the first category cluster with Languages & Editors per
spec §4.5.1 — 9 languages + 4 editors, brand-colored shields.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Replace Languages category (old) with Category 02 (DevOps & Tooling)

**Files:**
- Modify: `README.md` (replace the existing `### 🔨 Languages` block — it's the second sub-section under Skills)

- [ ] **Step 7.1: Replace the OLD `### 🔨 Languages` block + its `<p>...</p>` badges with Category 02**

Replace the entire block (starting with `### 🔨 Languages` through the closing `</p>`):

```markdown
### 🔨 Languages
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
  ...
  <img src="https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white" />
</p>
```

With Category 02:

````markdown
### 🧰 02 · DevOps & Tooling

```console
kaveh@github:~$ cat ~/skills/devops-tooling.md
```

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/docker--compose-384D54?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Podman-892CA0?style=flat-square&logo=podman&logoColor=white" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/SourceTree-0052CC?style=flat-square&logo=sourcetree&logoColor=white" />
  <img src="https://img.shields.io/badge/Poetry-60A5FA?style=flat-square&logo=poetry&logoColor=white" />
  <img src="https://img.shields.io/badge/UV-DE5FE9?style=flat-square&logo=astral&logoColor=white" />
  <img src="https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white" />
  <img src="https://img.shields.io/badge/SBT-DC322F?style=flat-square&logo=scala&logoColor=white" />
  <img src="https://img.shields.io/badge/Bazel-43A047?style=flat-square&logo=bazel&logoColor=white" />
  <img src="https://img.shields.io/badge/JIRA-0052CC?style=flat-square&logo=jira&logoColor=white" />
  <img src="https://img.shields.io/badge/pytest-0A9EDC?style=flat-square&logo=pytest&logoColor=white" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/Ruff-D7FF64?style=flat-square&logo=ruff&logoColor=black" />
  <img src="https://img.shields.io/badge/mypy-1F5082?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/JupyterHub-F37626?style=flat-square&logo=jupyter&logoColor=white" />
</p>
````

- [ ] **Step 7.2: Render-check**

Confirm 18 badges (Docker through JupyterHub) display in one cluster under "🧰 02 · DevOps & Tooling".

- [ ] **Step 7.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 02 DevOps & Tooling

Per spec §4.5.2 — 18 badges spanning containers, CI, VCS, package
managers, build tools, test/lint, and JupyterHub.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Replace Data Engineering & Big Data (old) with Category 03 (Backend, APIs & UI)

**Files:**
- Modify: `README.md` (replace the existing `### ☁️ Data Engineering & Big Data` block — third sub-section under Skills)

- [ ] **Step 8.1: Replace the OLD `### ☁️ Data Engineering & Big Data` block + its `<p>...</p>` badges with Category 03**

Replace the entire block. Insert in its place:

````markdown
### 🌐 03 · Backend, APIs & UI

```console
kaveh@github:~$ cat ~/skills/backend-apis-ui.md
```

<p>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white" />
  <img src="https://img.shields.io/badge/Gradio-FFCC33?style=flat-square&logo=gradio&logoColor=black" />
  <img src="https://img.shields.io/badge/NiceGUI-009688?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Textual-7DCFFF?style=flat-square&logo=python&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white" />
  <img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white" />
  <img src="https://img.shields.io/badge/Tauri-FFC131?style=flat-square&logo=tauri&logoColor=black" />
  <img src="https://img.shields.io/badge/Avalonia-8B44AC?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/Shiny-00ADD8?style=flat-square&logo=rstudio&logoColor=white" />
  <img src="https://img.shields.io/badge/ASP.NET_MVC-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/ASP.NET_WebForms-5C2D91?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/WPF-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/WCF-512BD4?style=flat-square&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/Xamarin-3498DB?style=flat-square&logo=xamarin&logoColor=white" />
  <img src="https://img.shields.io/badge/Silverlight-9B4F96?style=flat-square&logo=microsoft&logoColor=white" />
</p>
````

- [ ] **Step 8.2: Render-check**

Confirm 17 badges (FastAPI through Silverlight).

- [ ] **Step 8.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 03 Backend, APIs & UI

Per spec §4.5.3 — 17 badges across modern Python/JS backends,
UI frameworks (Streamlit, Gradio, NiceGUI, Textual, Svelte/Kit,
Tauri, Avalonia, Shiny), and the legacy .NET stack.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Replace Tools, Platforms & Databases (old) with Category 04 (Cloud & Distributed)

**Files:**
- Modify: `README.md` (replace the existing `### 🧰 Tools, Platforms & Databases` block — fourth sub-section under Skills)

- [ ] **Step 9.1: Replace the OLD `### 🧰 Tools, Platforms & Databases` block with Category 04**

Replace the entire OLD `<p>...</p>` cluster. Insert:

````markdown
### 🛰️ 04 · Cloud & Distributed

```console
kaveh@github:~$ cat ~/skills/cloud-distributed.md
```

<p>
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white" />
  <img src="https://img.shields.io/badge/GCP-4285F4?style=flat-square&logo=googlecloud&logoColor=white" />
  <img src="https://img.shields.io/badge/Kong-002659?style=flat-square&logo=kong&logoColor=white" />
  <img src="https://img.shields.io/badge/Ray-028CF0?style=flat-square&logo=ray&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Grafana-F46800?style=flat-square&logo=grafana&logoColor=white" />
</p>
````

- [ ] **Step 9.2: Render-check**

Confirm 7 badges (AWS, AWS EC2, GCP, Kong, Ray, Prometheus, Grafana).

- [ ] **Step 9.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 04 Cloud & Distributed

Per spec §4.5.4 — 7 badges: AWS / AWS EC2 / GCP for cloud,
Kong + Ray for distributed glue, Prometheus + Grafana for
observability.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Replace Web & UI Development (old) with Category 05 (Data Engineering & Storage)

**Files:**
- Modify: `README.md` (replace the existing `### 🌐 Web & UI Development` block — fifth sub-section under Skills)

This is the largest category (27 badges across 4 sub-sections).

- [ ] **Step 10.1: Replace the OLD `### 🌐 Web & UI Development` block with Category 05**

Replace the entire `<p>...</p>` cluster. Insert:

````markdown
### 🗄️ 05 · Data Engineering & Storage

```console
kaveh@github:~$ cat ~/skills/data-eng-storage.md
```

<sub>▸ SQL & Admin</sub>
<p>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_RDS-527FFF?style=flat-square&logo=amazonrds&logoColor=white" />
  <img src="https://img.shields.io/badge/pgAdmin-336791?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/MS_SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" />
  <img src="https://img.shields.io/badge/Snowflake-56B9EB?style=flat-square&logo=snowflake&logoColor=white" />
  <img src="https://img.shields.io/badge/DBeaver-372923?style=flat-square&logo=dbeaver&logoColor=white" />
  <img src="https://img.shields.io/badge/DuckDB-FFF000?style=flat-square&logo=duckdb&logoColor=black" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase_Studio-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLModel-7E56C2?style=flat-square&logo=pydantic&logoColor=white" />
  <img src="https://img.shields.io/badge/MapR--DB-005EB8?style=flat-square&logo=apache&logoColor=white" />
</p>

<sub>▸ KV, Graph & Vector</sub>
<p>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Neo4j-008CC1?style=flat-square&logo=neo4j&logoColor=white" />
  <img src="https://img.shields.io/badge/pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Weaviate-2E2E2E?style=flat-square&logo=weaviate&logoColor=white" />
</p>

<sub>▸ Object Storage</sub>
<p>
  <img src="https://img.shields.io/badge/AWS_S3-569A31?style=flat-square&logo=amazons3&logoColor=white" />
  <img src="https://img.shields.io/badge/MinIO-C72E49?style=flat-square&logo=minio&logoColor=white" />
</p>

<sub>▸ Big Data & Pipelines</sub>
<p>
  <img src="https://img.shields.io/badge/Scala_Spark-E25A1C?style=flat-square&logo=apachespark&logoColor=white" />
  <img src="https://img.shields.io/badge/PySpark-E25A1C?style=flat-square&logo=apachespark&logoColor=white" />
  <img src="https://img.shields.io/badge/Apache_Airflow-017CEE?style=flat-square&logo=apacheairflow&logoColor=white" />
  <img src="https://img.shields.io/badge/Apache_Iceberg-0E8A16?style=flat-square&logo=apache&logoColor=white" />
  <img src="https://img.shields.io/badge/Apache_Hadoop-66CCFF?style=flat-square&logo=apachehadoop&logoColor=black" />
  <img src="https://img.shields.io/badge/HDFS-66CCFF?style=flat-square&logo=apachehadoop&logoColor=black" />
  <img src="https://img.shields.io/badge/Apache_Zeppelin-2D2D2D?style=flat-square&logo=apachezeppelin&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EMR_Serverless-FF9900?style=flat-square&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/MapR-005EB8?style=flat-square&logo=apache&logoColor=white" />
</p>
````

- [ ] **Step 10.2: Render-check**

Confirm 4 `▸` sub-headers and 27 badges total (12 SQL & Admin + 4 KV/Graph/Vector + 2 Object Storage + 9 Big Data).

- [ ] **Step 10.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 05 Data Engineering & Storage

Per spec §4.5.5 — 27 badges across 4 subsections: SQL & Admin,
KV/Graph/Vector, Object Storage, Big Data & Pipelines.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Insert Category 06 (Machine Learning)

**Files:**
- Modify: `README.md` (append a new sub-section after Category 05 and before the `---` divider that precedes the Connect block)

By this point the OLD 5 categories have all been replaced with NEW categories 01–05. Now we append two new categories that didn't exist before.

- [ ] **Step 11.1: Insert Category 06 immediately after the Category 05 block, before the next `---`**

````markdown
### 🧠 06 · Machine Learning

```console
kaveh@github:~$ cat ~/skills/ml.md
```

<p>
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch_Lightning-792EE5?style=flat-square&logo=pytorchlightning&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch_Geometric-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white" />
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white" />
  <img src="https://img.shields.io/badge/ONNX-005CED?style=flat-square&logo=onnx&logoColor=white" />
  <img src="https://img.shields.io/badge/HuggingFace_Transformers-FFD21E?style=flat-square&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/sentence--transformers-FFD21E?style=flat-square&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/Embeddings-7DCFFF?style=flat-square&logo=vectorworks&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/spaCy-09A3D5?style=flat-square&logo=spacy&logoColor=white" />
  <img src="https://img.shields.io/badge/Diffusers-FFD21E?style=flat-square&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/NetworkX-2C3E50?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FAISS-00599C?style=flat-square&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/multi2vec--clip-A8D4E6?style=flat-square&logo=openai&logoColor=0B0D13" />
</p>
````

- [ ] **Step 11.2: Render-check**

Confirm 16 badges (PyTorch through multi2vec-clip).

- [ ] **Step 11.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 06 Machine Learning

Per spec §4.5.6 — 16 badges spanning core PyTorch stack,
HuggingFace, embeddings (concept badge), classical libs,
and multimodal CLIP.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Insert Category 07 (GenAI) with 7 sub-sections

**Files:**
- Modify: `README.md` (append a new sub-section after Category 06)

The largest category — 34 badges across 7 sub-sections.

- [ ] **Step 12.1: Insert Category 07 immediately after the Category 06 block**

````markdown
### ✨ 07 · GenAI

```console
kaveh@github:~$ cat ~/skills/genai.md
```

<sub>▸ Agent frameworks</sub>
<p>
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/CrewAI-FF5A36?style=flat-square&logo=crewai&logoColor=white" />
  <img src="https://img.shields.io/badge/AutoGen-0078D4?style=flat-square&logo=microsoft&logoColor=white" />
  <img src="https://img.shields.io/badge/Pydantic_AI-E92063?style=flat-square&logo=pydantic&logoColor=white" />
</p>

<sub>▸ Prompting & Protocols</sub>
<p>
  <img src="https://img.shields.io/badge/DSPy-FF9E64?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/MCP-BB9AF7?style=flat-square&logo=anthropic&logoColor=0B0D13" />
</p>

<sub>▸ LLM gateways & APIs</sub>
<p>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Anthropic-D97757?style=flat-square&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_Bedrock-FF9900?style=flat-square&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-F55036?style=flat-square&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-1E1E1E?style=flat-square&logo=openrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/LiteLLM-6C47FF?style=flat-square&logo=litellm&logoColor=white" />
  <img src="https://img.shields.io/badge/vLLM-0F62FE?style=flat-square&logo=python&logoColor=white" />
</p>

<sub>▸ Harnesses</sub>
<p>
  <img src="https://img.shields.io/badge/Cursor-5436DA?style=flat-square&logo=cursor&logoColor=white" />
  <img src="https://img.shields.io/badge/Cline-2D2D2D?style=flat-square&logo=gnubash&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude_Code-1A1B26?style=flat-square&logo=anthropic&logoColor=BB9AF7" />
  <img src="https://img.shields.io/badge/OpenCode-0B0D13?style=flat-square&logo=opencode&logoColor=7DCFFF" />
  <img src="https://img.shields.io/badge/KiloCode-0B0D13?style=flat-square&logo=kilo&logoColor=7DCFFF" />
  <img src="https://img.shields.io/badge/Hermes_Agent-7DCFFF?style=flat-square&logo=nousresearch&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/OpenClaw-BB9AF7?style=flat-square&logo=anthropic&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/Deep_Researcher-A8D4E6?style=flat-square&logo=langchain&logoColor=0B0D13" />
</p>

<sub>▸ RAG</sub>
<p>
  <img src="https://img.shields.io/badge/RAG-7DCFFF?style=flat-square&logo=databricks&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/LightRAG-4A9EFF?style=flat-square&logo=lightning&logoColor=white" />
  <img src="https://img.shields.io/badge/RAG--Anything-A8D4E6?style=flat-square&logo=python&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/Vanilla_RAG-B4F9F8?style=flat-square&logo=python&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/Docling-0F62FE?style=flat-square&logo=ibm&logoColor=white" />
</p>

<sub>▸ GenAI Media</sub>
<p>
  <img src="https://img.shields.io/badge/Parakeet-76B900?style=flat-square&logo=nvidia&logoColor=white" />
  <img src="https://img.shields.io/badge/Chatterbox-BB9AF7?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/ComfyUI-2D2D2D?style=flat-square&logo=python&logoColor=white" />
</p>

<sub>▸ Workflows & UIs</sub>
<p>
  <img src="https://img.shields.io/badge/LangFuse-FFFFFF?style=flat-square&logo=langfuse&logoColor=0B0D13" />
  <img src="https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Open_WebUI-FFFFFF?style=flat-square&logo=openai&logoColor=0B0D13" />
</p>
````

- [ ] **Step 12.2: Render-check**

Confirm 7 `▸` sub-headers and 34 badges total (5 + 2 + 8 + 8 + 5 + 3 + 3).

- [ ] **Step 12.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): add category 07 GenAI

Per spec §4.5.7 — 34 badges across 7 subsections: Agent frameworks,
Prompting & Protocols, LLM gateways & APIs, Harnesses, RAG, GenAI
Media, Workflows & UIs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Verify and lock the Connect block

**Files:**
- Inspect: `README.md` (the `kaveh@github:~$ ./connect` console block + the centered 3-badge div)

Per spec §4.6 — the current draft block already matches the spec verbatim. Verification only.

- [ ] **Step 13.1: Confirm the Connect block matches the spec**

Look for this block in `README.md`:

````markdown
```console
kaveh@github:~$ ./connect
> LinkedIn : linkedin.com/in/kavehrazavi
> Email    : kaveh dot razavi at gmail dot com
```

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-7AA2F7?style=for-the-badge&logo=linkedin&logoColor=1A1B26)](https://linkedin.com/in/kavehrazavi)
[![Email](https://img.shields.io/badge/Email-9ECE6A?style=for-the-badge&logo=gmail&logoColor=1A1B26)](mailto:kaveh.razavi@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-BB9AF7?style=for-the-badge&logo=github&logoColor=1A1B26)](https://github.com/kavehrazavi)

</div>
````

Badge colors: LinkedIn `#7AA2F7`, Email `#9ECE6A`, GitHub `#BB9AF7`. Logo color `#1A1B26` on all three. Links must point to the URLs shown.

If it matches, move to Task 14 with no commit. If it doesn't, edit to match, render-check, then commit with message `feat(readme): align connect block with spec`.

---

## Task 14: Update footer comment

**Files:**
- Modify: `README.md` (last line — the HTML comment at the bottom)

- [ ] **Step 14.1: Replace the existing footer comment**

Replace:

```html
<!-- terminal profile: Tokyo Night palette | generated for kavehrazavi -->
```

With:

```html
<!-- terminal profile · Tokyo Night palette · GenAI-Vanilla LOGO_GRADIENT hero · generated for kavehrazavi -->
```

- [ ] **Step 14.2: Render-check**

Confirm the comment is the last line of the file and matches the new content. (The comment is invisible in rendered output, but is visible in "view raw" — that's the audience.)

- [ ] **Step 14.3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
feat(readme): update footer comment to reference LOGO_GRADIENT hero

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Delete the superseded `profile-terminal.svg`

**Files:**
- Delete: `assets/profile-terminal.svg`

The new `profile-hero.svg` is now the only hero asset referenced. The old static SVG can be removed.

- [ ] **Step 15.1: Confirm no remaining references to the old SVG**

Run: `grep -rn "profile-terminal" .`
Expected: no matches in `README.md`. (Matches in `.superpowers/brainstorm/...` mockup files are fine — those are gitignored.)

If `README.md` still references it, go back to Task 2 and fix.

- [ ] **Step 15.2: Delete the file and commit**

```bash
git rm assets/profile-terminal.svg
git commit -m "$(cat <<'EOF'
chore: remove superseded profile-terminal.svg

Superseded by assets/profile-hero.svg (animated, brighter row 4,
updated tagline).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Push and verify on github.com

**Files:** none.

Runs the 7-item acceptance checklist from spec §6 against the live rendered page.

- [ ] **Step 16.1: Push to remote**

```bash
git push origin main
```

Expected: push succeeds.

- [ ] **Step 16.2: Open the live profile**

```bash
open https://github.com/kavehrazavi
```

(If `kavehrazavi` is not the username, substitute the actual GitHub handle.)

- [ ] **Step 16.3: Walk the acceptance checklist**

For each item, confirm in the browser tab:

1. **Hero renders correctly** — block-art "KAVEH" shows the per-row LOGO_GRADIENT (rows are blue / cyan / glacier / **bright glacier** / glacier / cyan), tagline below reads `Lead Staff Software Engineer → ML/AI Researcher & Engineer // GenAI · Distributed Systems · Automation`, and the chrome bar shows three traffic-lights + `kaveh@github:~/profile` left / `BLOCKLOGO · LOGO_GRADIENT` right.
2. **Hero animations play** — the block-art glow visibly "breathes" over ~5 seconds; the `█` cursor at the end of the prompt line blinks roughly every 1.1 seconds. (If they don't play, GitHub's image proxy may have stripped the SMIL/CSS — fall back is acceptable per spec §4.1.1 ("degrade silently"); flag for follow-up but do not block.)
3. **All seven skill categories appear in order**: 01 Languages & Editors, 02 DevOps & Tooling, 03 Backend / APIs / UI, 04 Cloud & Distributed, 05 Data Engineering & Storage, 06 Machine Learning, 07 GenAI. Sub-sections appear inside 01, 05, and 07.
4. **Projects section** shows 5 cards in 3 + 2 layout (genai-vanilla, GuideArch, NNx on row 1; VMx, ml-lab, empty on row 2). All five project names link to the right repos.
5. **Connect section** renders LinkedIn (Tokyo blue), Email (Tokyo green), GitHub (Tokyo purple) `for-the-badge` badges. Click each — they go to `linkedin.com/in/kavehrazavi`, `mailto:kaveh.razavi@gmail.com`, and `github.com/kavehrazavi` respectively.
6. **No third-party widgets** present — no github-readme-stats panels, no trophy widgets, no streak counters, no visitor counters.
7. **View source** the SVG via `view-source:https://raw.githubusercontent.com/kavehrazavi/kavehrazavi/main/assets/profile-hero.svg` — confirm no `<script>` tags. Animations should use `<animate>` (SMIL) and `<style>` `@keyframes` only.

- [ ] **Step 16.4: Final cleanup — stop the visual companion server**

```bash
ls .superpowers/brainstorm/ 2>/dev/null | head -3
# If a session dir is listed, stop the server:
/Users/kaveh/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh .superpowers/brainstorm/$(ls -t .superpowers/brainstorm | head -1)
```

Expected: server exits cleanly. Session content remains in `.superpowers/brainstorm/` (gitignored) for future reference.

No commit — this is local-only cleanup.

---

## Self-review notes (post-write)

- **Spec coverage:**
  - §3.1 palette → used directly in Task 1 SVG and Task 9–12 badge colors.
  - §3.2 typography → enforced inside the SVG `<style>` (Task 1).
  - §4.1 hero → Task 1.
  - §4.2 identity card → Task 3.
  - §4.3 mission → Task 4 (verify-only).
  - §4.4 projects → Task 5.
  - §4.5 skills (7 categories) → Tasks 6–12.
  - §4.6 connect → Task 13 (verify-only).
  - §4.7 footer → Task 14.
  - §5 file changes → Tasks 1, 15.
  - §6 acceptance criteria → Task 16.
- **Placeholder scan:** no TBD / TODO / "add appropriate". All badge URLs explicit. All commit messages spelled out.
- **Type / name consistency:** SVG filename `profile-hero.svg` used consistently in Tasks 1, 2, 15, 16. Section heading "Skills" used consistently in Task 6 onwards. Category emoji-and-number-prefix style (`🔨 01 ·`, `🧰 02 ·`, etc.) used uniformly Tasks 6–12.
