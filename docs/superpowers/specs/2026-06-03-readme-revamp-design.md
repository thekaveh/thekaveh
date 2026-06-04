# README Revamp — Design Spec

**Date:** 2026-06-03
**Repo:** `thekaveh/thekaveh` (GitHub profile README)
**Status:** Approved via `/superpowers:brainstorming`

---

## 1. Goal

Replace the current GitHub profile README (a flat header + 5 badge clusters + plain-text links) with a sleek, sci-fi-leaning, Tokyo-Night-themed page that reads like a real engineer's terminal session and showcases the work behind the profile. Keep the icons-as-skills concept; expand the skill inventory ~6× based on the actual stack across the author's repos and CV.

## 2. Out of scope

Explicitly decided against — do **not** add these later:

- `github-readme-stats` widget panels (rejected in composition choice — third-party widgets age badly).
- Trophy / streak / visitor-count widgets (cliché).
- Animated GIFs / banners outside the hero SVG (overdone).
- A separate "operating principles" tile (rejected in favour of B over C).
- `SearxNG`, `Speaches`, `Whisper`, `Stable Diffusion` as their own badges (resolved as implicit through Parakeet / ComfyUI / Diffusers).
- Network-tool badges (`Wireshark`, `Charles Proxy`, `Tailscale`) — too tactical for a profile.
- `MkDocs`, `Vite`, `Vitest`, `Apache Kafka`, `R`, `LlamaIndex` — cut during iteration.

---

## 3. Visual system

### 3.1 Palette

Tokyo Night base with the GenAI-Vanilla `LOGO_GRADIENT` reserved for the hero block art.

| Role                        | Hex       | Use                                                          |
|-----------------------------|-----------|--------------------------------------------------------------|
| Background                  | `#0B0D13` | Page background (radial ambient blue+cyan overlay on top).   |
| Surface                     | `#0E0F18` | Terminal-window inner fill.                                  |
| Terminal-bar gradient ends  | `#11131D` | Outer ends of the chrome-bar gradient.                       |
| Terminal-bar gradient mid   | `#1A1E30` | Middle of the chrome-bar gradient.                           |
| Border / divider            | `#2B2F4A` | Section separators and tile borders.                         |
| Comment / muted text        | `#565F89` | Secondary labels, file paths.                                |
| Foreground                  | `#C0CAF5` | Body text.                                                   |
| Tokyo blue                  | `#7AA2F7` | LinkedIn badge.                                              |
| Tokyo cyan                  | `#7DCFFF` | Prompts (`$`), highlights, current-section accent.           |
| Tokyo purple                | `#BB9AF7` | GitHub badge, "labels," sub-section markers.                 |
| Tokyo green                 | `#9ECE6A` | Email badge, status dots, success states.                    |
| Tokyo yellow                | `#E0AF68` | Warning / accent dot in terminal traffic-lights.             |
| Tokyo red                   | `#F7768E` | Close dot in terminal traffic-lights.                        |
| `LOGO_GRADIENT` row 1       | `#4A9EFF` | Hero block-art row 1 + row 6 (deep brand blue).              |
| `LOGO_GRADIENT` row 2       | `#7DCFFF` | Hero block-art row 2 + row 5 (cyan).                         |
| `LOGO_GRADIENT` row 3       | `#A8D4E6` | Hero block-art row 3 (pale glacier blue).                    |
| `LOGO_GRADIENT` row 4       | `#B4F9F8` | Hero block-art row 4 (brightest, glacier highlight).         |

### 3.2 Typography

Single font stack everywhere:

```
'JetBrains Mono', 'SFMono-Regular', 'Cascadia Code', 'Menlo', 'Consolas', monospace
```

Sizes (within the SVG hero — body relies on GitHub's renderer):
- Block-art letters: 28px, weight 800, letter-spacing −1.25px.
- Prompt lines: 15px, letter-spacing 0.05em.
- Terminal-bar / footer micro-labels: 12px, letter-spacing 0.04em.

### 3.3 Motif

Every section sits inside one **terminal window frame** (chrome bar with three traffic-lights, prompt, output). Within that frame, the content blends terminal idioms (`$` prompts, code blocks, ASCII corners) with magazine-style typography (cards, category badge clusters). This is **Composition B / Style C** from brainstorming — "Hybrid — terminal frame, magazine inside."

---

## 4. Page composition (top to bottom)

The README has **six sections** inside the terminal frame plus a footer:

1. **Hero** — SVG block-art `KAVEH` + tagline.
2. **Identity card** — TypeScript-style object literal showing role, education, focus.
3. **Mission** — single `$ ./mission --current` prompt + one-line manifesto.
4. **Now Shipping** — five featured-project cards (3 + 2 layout).
5. **Skills** — 7 categories of categorized badge clusters (the main keep + expansion).
6. **Connect** — `$ ./connect` prompt + LinkedIn / Email / GitHub badges.
7. **Footer comment** — HTML comment + a single muted byline.

Section divider is a horizontal rule with the dashed-line `─` style implicitly via markdown `---`.

### 4.1 Hero (SVG)

- **File:** `assets/profile-hero.svg` (replaces existing `assets/profile-terminal.svg`; keep file path stable so we don't need to rewrite docs that reference it).
- **Dimensions:** `960 × 420` viewBox (matches existing).
- **Content (top to bottom inside the SVG):**
  - Rounded-rect terminal window with chrome bar (three traffic-light dots: red `#F7768E`, yellow `#E0AF68`, green `#98C379`).
  - Chrome-bar left label: `kaveh@github:~/profile` (color `#565F89`, 12px).
  - Chrome-bar right label: `BLOCKLOGO · LOGO_GRADIENT` (color `#7DCFFF`, 12px, letter-spaced).
  - Prompt line below chrome: `$ render_name --text KAVEH --style block-logo --gradient logo` (color `#7DCFFF`, 15px).
  - 6-row block-art rendering of **KAVEH** in ANSI-Shadow font, per-row solid `LOGO_GRADIENT`:
    - Row 1: `#4A9EFF`
    - Row 2: `#7DCFFF`
    - Row 3: `#A8D4E6`
    - Row 4: `#B4F9F8` *(brightest — glacier center)*
    - Row 5: `#A8D4E6`
    - Row 6: `#7DCFFF`
    *(Matches the BlockLogo Textual renderer used by `genai-vanilla/bootstrapper/utils/banner.py` semantics — per-row solid, not per-character.)*
  - Subtle Gaussian glow filter (`rowGlow`, stdDeviation 1.4) on the block-art group.
  - Below the art: a thin divider line.
  - Tagline row, three pieces in muted/highlighted Tokyo Night:
    - Left, cyan `#7DCFFF`: `Lead Staff Software Engineer`
    - Separator arrow, comment `#565F89`: `→`
    - Middle, glacier `#A8D4E6`: `Machine Learning Engineer`
    - Separator slash, comment `#565F89`: `//`
    - Right, cyan `#7DCFFF`: `GenAI · Distributed Systems · Automation`

#### 4.1.1 Subtle animations (SMIL / declarative CSS only — no `<script>`)

Two motion accents. Both must work when the SVG is referenced as `<img src=…>` (GitHub strips `<script>` but allows SMIL and CSS `@keyframes` inside SVG `<style>`).

1. **Breathing glow on the block-art letters** — animate the glow filter's `stdDeviation` between 1.2 and 2.0 over 5s, easing `ease-in-out`, infinite.
2. **Blinking cursor at the end of the prompt line** — append a `█` cursor glyph after the prompt; animate its `opacity` between 1.0 and 0.0 over 1.1s, infinite, with a 50% duty cycle.

Implementation: embed `<style>` inside the SVG with `@keyframes` rules and apply via class selectors. SMIL `<animate>` is acceptable as a fallback if a renderer ignores SVG CSS keyframes. **Do not use `<script>`** — it'll be stripped by GitHub's image proxy.

### 4.2 Identity card

A TypeScript code block. GitHub will syntax-highlight; the structure itself is the value.

```ts
const kaveh = {
  role: "Lead Staff Software Engineer · Data & ML",
  trajectory: "Software Engineering → Machine Learning Engineering",
  education: [
    "M.Eng Machine Learning @ Virginia Tech",
    "M.Sc Software Engineering @ George Mason University"
  ],
  currentFocus: [
    "GenAI systems",
    "distributed data platforms",
    "automation tooling",
    "clean, scalable architectures"
  ],
  operatingMode: "ship useful systems, keep the architecture clean, automate the boring parts"
};
```

Rules:
- Keep `currentFocus` array to 4 items max.
- `operatingMode` is one line.
- No trailing comma after the final property (matches the brand of "actually compiles").

### 4.3 Mission

```console
kaveh@github:~$ ./mission --current
> Building scalable systems that turn data, models, and automation into practical leverage.
```

One-liner manifesto, kept verbatim from current draft. The `>` answer line stays in the console fence so syntax highlighting renders it bold-grey on dark.

### 4.4 Now Shipping — project cards

A new section. Five featured projects rendered as a card grid via an HTML table inside the markdown (GitHub supports `<table>`; CSS is ignored but cells render). Use a **3 + 2 layout** (row 1: three cards, row 2: two cards, left-aligned) rather than a single 5-column row — five-across makes each card too narrow on standard GitHub viewport widths.

**Projects (full set, in order):**

| # | Project          | One-line description                                                                                                | URL                                          |
|---|------------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| 1 | `genai-vanilla`  | Modular GenAI stack with a Textual TUI bootstrapper — orchestrates 30+ services.                                    | `https://github.com/thekaveh/genai-vanilla`  |
| 2 | `GuideArch`      | Fuzzy TOPSIS architecture-decision tool — three concurrent implementations sharing one spec.                         | `https://github.com/thekaveh/GuideArch`      |
| 3 | `NNx`            | PyTorch training / eval / visualization toolkit with first-class GNN support.                                       | `https://github.com/thekaveh/NNx`            |
| 4 | `VMx`            | Lifecycle-aware MVVM framework — one spec, four language flavors (C# · Python · TypeScript · Swift), 232 conformance tests. | `https://github.com/thekaveh/VMx`        |
| 5 | `ml-lab`         | Personal ML lab — portfolio of self-contained `[task]-[dataset]-[model]-[framework]` experiments built on `nnx`.    | `https://github.com/thekaveh/ml-lab`         |

Card content per project:
- Prompt header above the grid: `$ ls ~/now-shipping/`
- Card title with `▸` glyph and project name (purple `#BB9AF7`).
- One-line description (muted `#565F89`).
- "Open in GitHub" link rendered as a small badge under the description.

Row layout in the HTML table:
- Row 1 (`<tr>`): cards 1, 2, 3 (genai-vanilla · GuideArch · NNx).
- Row 2 (`<tr>`): cards 4, 5, and one empty `<td>` to keep column widths consistent (VMx · ml-lab · —).

### 4.5 Skills — 7 categories, ~129 badges

**Order** (basic → complex):

```
01 Languages & Editors
02 DevOps & Tooling
03 Backend, APIs & UI
04 Cloud & Distributed
05 Data Engineering & Storage
06 Machine Learning
07 GenAI
```

Each category gets:
- A console-prompt header: `$ cat ~/skills/<slug>.md`
- A title row: emoji icon + category name (cyan `#7DCFFF`).
- One or more sub-section sub-headers (small uppercase, muted) where the category warrants it (Languages & Editors, Data Engineering & Storage, GenAI).
- Badge cluster via `<img src="https://img.shields.io/badge/...">` tags — `style=flat-square` everywhere, consistent slug case, brand colors where shields.io supports them.

#### 4.5.1 Category 01 — Languages & Editors

```
▸ Languages
  Python · TypeScript · Scala · Java · C# · Swift · JavaScript · Objective-C · ActionScript

▸ Editors
  Visual Studio · VS Code · IntelliJ IDEA · XCode
```

#### 4.5.2 Category 02 — DevOps & Tooling

Single cluster, 17 badges:

```
Docker · docker-compose · Podman · Jenkins · GitHub Actions
Git · SourceTree · Poetry · UV · Maven · SBT · Bazel · JIRA
pytest · Playwright · Ruff · mypy · JupyterHub
```

#### 4.5.3 Category 03 — Backend, APIs & UI

Single cluster, 17 badges:

```
FastAPI · Express.js · Streamlit · Gradio · NiceGUI · Textual
Svelte · SvelteKit · Tauri · Avalonia · Shiny
ASP.NET MVC · ASP.NET WebForms · WPF · WCF · Xamarin · Silverlight
```

#### 4.5.4 Category 04 — Cloud & Distributed

Single cluster, 7 badges:

```
AWS · AWS EC2 · GCP · Kong · Ray · Prometheus · Grafana
```

#### 4.5.5 Category 05 — Data Engineering & Storage

Four sub-sections:

```
▸ SQL & Admin
  PostgreSQL · AWS RDS · pgAdmin · MS SQL Server · Snowflake
  DBeaver · DuckDB · Supabase · Supabase Studio
  SQLAlchemy · SQLModel · MapR-DB

▸ KV, Graph & Vector
  Redis · Neo4j · pgvector · Weaviate

▸ Object Storage
  AWS S3 · MinIO

▸ Big Data & Pipelines
  Scala Spark · PySpark · Apache Airflow · Apache Iceberg
  Apache Hadoop · HDFS · Apache Zeppelin · AWS EMR Serverless · MapR
```

#### 4.5.6 Category 06 — Machine Learning

Single cluster, 16 badges:

```
PyTorch · PyTorch Lightning · PyTorch Geometric · scikit-learn
Pandas · NumPy · Jupyter · ONNX
HuggingFace Transformers · sentence-transformers · Embeddings
spaCy · Diffusers · NetworkX · FAISS · multi2vec-clip
```

#### 4.5.7 Category 07 — GenAI

Seven sub-sections (note: subsection labeled "Harnesses" per brainstorming consensus — keep that exact term):

```
▸ Agent frameworks
  LangChain · LangGraph · CrewAI · AutoGen · Pydantic AI

▸ Prompting & Protocols
  DSPy · MCP

▸ LLM gateways & APIs
  OpenAI · Anthropic · AWS Bedrock · Ollama · Groq · OpenRouter · LiteLLM · vLLM

▸ Harnesses
  Cursor · Cline · Claude Code · OpenCode · KiloCode
  Hermes Agent · OpenClaw · Deep Researcher

▸ RAG
  RAG · LightRAG · RAG-Anything · Vanilla RAG · Docling

▸ GenAI Media
  Parakeet · Chatterbox · ComfyUI

▸ Workflows & UIs
  LangFuse · n8n · Open WebUI
```

### 4.6 Connect

```console
kaveh@github:~$ ./connect
> LinkedIn : linkedin.com/in/kavehrazavi
> Email    : kaveh dot razavi at gmail dot com
```

Below: three large `style=for-the-badge` badges centered in a `<div align="center">`:

| Service   | Color (badge bg) | Text color | Logo color | Link                                    |
|-----------|------------------|------------|------------|-----------------------------------------|
| LinkedIn  | `#7AA2F7`        | `#1A1B26`  | `#1A1B26`  | `https://linkedin.com/in/kavehrazavi`   |
| Email     | `#9ECE6A`        | `#1A1B26`  | `#1A1B26`  | `mailto:kaveh.razavi@gmail.com`         |
| GitHub    | `#BB9AF7`        | `#1A1B26`  | `#1A1B26`  | `https://github.com/kavehrazavi`        |

### 4.7 Footer

Single HTML comment + one-line muted byline, e.g.:

```
<!-- terminal profile · Tokyo Night palette · GenAI-Vanilla LOGO_GRADIENT hero · generated for kavehrazavi -->
```

---

## 5. File-level changes

| Path                          | Action  | Notes                                                                              |
|-------------------------------|---------|------------------------------------------------------------------------------------|
| `README.md`                   | Rewrite | Replace entire body per Section 4.                                                  |
| `assets/profile-hero.svg`     | Create  | New SVG per Section 4.1; keep `assets/profile-terminal.svg` until verified, then delete. |
| `assets/profile-terminal.svg` | Delete (later) | After `README.md` switches to `profile-hero.svg` and renders correctly.       |
| `.gitignore`                  | (already added during brainstorming) | `.superpowers/` excluded.                                     |

No new dependencies, build steps, or CI changes.

---

## 6. Acceptance criteria

The implementation is "done" when all of the following are true:

1. **Hero renders correctly on github.com** for both the logged-in and anonymous view of `https://github.com/kavehrazavi`. Block-art letters show the per-row gradient; tagline below renders in Tokyo Night colors; chrome bar shows three traffic-lights and labels.
2. **Hero animations play** (breathing glow + blinking cursor) in browsers that render SVG with CSS keyframes — and degrade silently (static SVG) in any renderer that doesn't.
3. **All seven skill categories appear in the documented order** with their subsections (where applicable) and exact badge sets from Section 4.5.
4. **Now-shipping section** shows the five project cards with title + description + working link to each repo, in a 3 + 2 layout.
5. **Connect section** renders the three colored badges and they link to the right targets.
6. **No third-party widgets** were added (no `github-readme-stats`, no trophies, no streaks).
7. **No `<script>` in the SVG** — the file passes through GitHub's image proxy unmodified.

---

## 7. Open implementation questions (deferred to writing-plans phase)

These don't change the design but need a decision before/during implementation:

- Whether to ship the SVG as a single self-contained file or split tagline into a second SVG so the hero block can be wider on small screens. **Recommendation:** single file; SVG scales fluidly.
- Exact `RAZAVI` ASCII glyphs are **not needed** since the locked hero is "KAVEH" alone — confirmed in brainstorming.
- Whether to add or swap any project in §4.4 — current picks (`genai-vanilla`, `GuideArch`, `NNx`, `VMx`, `ml-lab`) reflect recency and completeness; `LinguAI` is the most likely 6th if you want a 3 + 3 grid instead of 3 + 2. Flag at PR review.
