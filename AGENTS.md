# AGENTS.md — Resume Builder

> **Read this file completely before writing a single line of code.**
> This file is the single source of truth for all AI agents (Cursor and Antigravity) working on this project.
> Every rule here exists to reduce token waste, prevent rework, and ensure consistency across sessions.

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| **Project name** | Resume Builder with Keyword Scoring |
| **PRD** | `docs/Resume_Builder_PRD_v2.docx` — read this for full requirements |
| **Stack** | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand · FastAPI (Python) |
| **OS / Environment** | Windows — all paths use backslashes in PowerShell, forward slashes in code |
| **Release model** | Two phases — Phase 1: Resume Builder · Phase 2: Keyword Scoring |
| **Active branch** | Check `git branch` — never commit directly to `main` or `develop` |

---

## 2. Repository Structure — Learn This First

```
resume-builder/
├── docs/
│   └── Resume_Builder_PRD_v2.docx        ← Full product requirements — READ THIS
├── frontend/                              ← Next.js app root (npx create-next-app output)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                   ← Landing page
│   │   │   ├── template-preview/          ← DEV ONLY preview route (remove before prod)
│   │   │   ├── (resume-builder)/
│   │   │   │   ├── templates/page.tsx     ← Template selection
│   │   │   │   └── editor/page.tsx        ← Split-screen editor (Phase 1 core)
│   │   │   └── keyword-scoring/           ← Phase 2 pages
│   │   ├── components/
│   │   │   ├── ui/                        ← Generic reusable UI (buttons, badges, toasts)
│   │   │   ├── editor/                    ← Accordion, forms, RichTextEditor
│   │   │   ├── templates/                 ← Template thumbnail cards
│   │   │   ├── word-cloud/                ← Phase 2: word cloud component
│   │   │   └── score/                     ← Phase 2: match score widget
│   │   ├── templates/
│   │   │   ├── source/                    ← Original .docx source files (DO NOT DELETE)
│   │   │   │   └── template-1-clean.docx
│   │   │   ├── template-1/
│   │   │   │   ├── Template1.tsx          ← Pure display component, no interactivity
│   │   │   │   ├── index.ts               ← Re-export only
│   │   │   │   └── sampleData.ts          ← Fictional test data only
│   │   │   ├── template-2/                ← Coming Soon placeholder
│   │   │   └── template-3/                ← Coming Soon placeholder
│   │   ├── store/
│   │   │   └── resumeStore.ts             ← Zustand store — single source of UI state
│   │   ├── types/
│   │   │   └── resume.ts                  ← ALL TypeScript types — import from here always
│   │   ├── hooks/
│   │   │   └── useScaleToFit.ts           ← ResizeObserver hook for preview scaling
│   │   └── lib/
│   │       ├── exportResume.ts            ← exportAsDocx() and exportAsPdf()
│   │       └── pdf/
│   │           └── ResumePdfDocument.tsx  ← @react-pdf/renderer document component
│   └── package.json
└── backend/
    ├── main.py                            ← FastAPI app entry point
    ├── routers/
    │   ├── parse.py                       ← POST /api/parse-resume
    │   └── score.py                       ← POST /api/keyword-score, /api/word-cloud
    ├── services/
    │   ├── parser.py                      ← python-docx + pdfplumber logic
    │   ├── scorer.py                      ← sentence-transformers cosine similarity
    │   └── wordcloud_gen.py               ← spaCy keyword extraction
    ├── models/
    │   └── schemas.py                     ← Pydantic request/response models
    ├── utils/
    └── .env
```

---

## 3. Golden Rules — Non-Negotiable

These rules apply to every agent, every session, every file.

### 3.1 Read Before You Write
- **Always** read `src/types/resume.ts` before touching any component or store file
- **Always** read the file you are about to edit before editing it
- If a file does not exist yet, check whether it is in the structure above before creating it elsewhere

### 3.2 One Task Per Session
- Each agent session has exactly one deliverable (e.g. "build the Zustand store" OR "build the accordion panel" — never both)
- If a task feels too large for one session, ask the user to split it before starting
- Never refactor unrelated files during a session — stay inside the session's scope

### 3.3 Never Install Packages
- All npm and pip packages are already installed
- **Do not run `npm install`, `pip install`, or any package manager commands**
- If you believe a package is missing, tell the user which package is needed and why — do not install it yourself
- Exception: the user will explicitly tell you when an install is needed

### 3.4 Never Modify These Files Without Explicit Instruction
- `src/types/resume.ts` — types are agreed upfront; changing them breaks all consumers
- `src/templates/template-1/Template1.tsx` — the display component is locked after Phase 1 Step 3
- `tailwind.config.ts` and `next.config.ts` — infrastructure files, touch only if instructed
- Any file inside `src/templates/source/` — these are read-only reference files

### 3.5 Tailwind Only — No Exceptions
- All styling uses **Tailwind CSS utility classes only**
- No inline `style={{}}` props
- No CSS Modules (no `.module.css` files)
- No styled-components, Emotion, or any CSS-in-JS
- Use `clsx` and `tailwind-merge` for conditional class logic

### 3.6 TypeScript Strictness
- No `any` type — ever. Use `unknown` and narrow it, or define a proper type in `resume.ts`
- No `// @ts-ignore` comments
- All props must have explicit TypeScript interfaces
- All exported functions must have explicit return types

### 3.7 Components Are Dumb or Smart — Not Both
- **Display components** (in `src/templates/`) — accept props only, no store access, no side effects, no event handlers
- **Form components** (in `src/components/editor/`) — read and write to `useResumeStore` only, no local state for form values
- **Page components** (in `src/app/`) — compose display and form components, handle routing

### 3.8 No Hardcoded Content
- No real personal data in any source file
- No hardcoded strings that belong in the PRD (error messages, button labels) — use the exact wording from `docs/Resume_Builder_PRD_v2.docx`
- Placeholder text in empty fields must be in `text-gray-300 italic` — never styled as real content

---

## 4. Tech Stack Reference

### 4.1 Frontend — Installed Packages

| Package | Purpose | Import as |
|---------|---------|-----------|
| `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-underline` | Rich text editor | `import { useEditor, EditorContent } from '@tiptap/react'` |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Drag-and-drop section reordering | `import { DndContext } from '@dnd-kit/core'` |
| `zustand` | Global resume state | `import { create } from 'zustand'` |
| `immer` | Immutable state updates in Zustand | `import { immer } from 'zustand/middleware/immer'` |
| `react-wordcloud`, `d3-cloud` | Word cloud rendering (Phase 2 only) | `import ReactWordcloud from 'react-wordcloud'` |
| `docx`, `file-saver` | Export resume as .docx | `import { Document, Packer } from 'docx'` |
| `@react-pdf/renderer` | Export resume as .pdf | `import { PDFDownloadLink } from '@react-pdf/renderer'` |
| `react-dropzone` | File upload (Phase 2 only) | `import { useDropzone } from 'react-dropzone'` |
| `clsx`, `tailwind-merge` | Safe conditional Tailwind classes | `import { cn } from '@/lib/utils'` |
| `lucide-react` | Icons | `import { ChevronDown } from 'lucide-react'` |
| `mammoth` | Client-side .docx preview fallback (Phase 2) | `import mammoth from 'mammoth'` |

> **Create `src/lib/utils.ts`** with `export function cn(...inputs) { return twMerge(clsx(inputs)) }` if it does not already exist.

### 4.2 Backend — Python Packages (inside `backend/venv`)

| Package | Purpose |
|---------|---------|
| `fastapi`, `uvicorn` | API framework and ASGI server |
| `python-multipart` | File upload handling in FastAPI |
| `python-docx` | Parse `.docx` resume uploads |
| `pdfplumber` | Parse `.pdf` resume uploads |
| `spacy` (model: `en_core_web_sm`) | Keyword extraction from job descriptions |
| `sentence-transformers` (model: `all-MiniLM-L6-v2`) | Semantic embeddings for scoring |
| `scikit-learn` | Cosine similarity computation |

### 4.3 Backend API Endpoints

| Method | Path | Purpose | Phase |
|--------|------|---------|-------|
| POST | `/api/parse-resume` | Accepts `.docx` or `.pdf`, returns structured `ResumeData` JSON | 2 |
| POST | `/api/keyword-score` | Accepts resume text, returns cosine similarity score 0–100 | 2 |
| POST | `/api/word-cloud` | Accepts JD text, returns keyword frequency array | 2 |

> Phase 1 has **no backend calls**. All Phase 1 functionality is client-side only.

---

## 5. Data Model — Resume Types

The canonical types live in `src/types/resume.ts`. Always import from there. Never redefine types locally. Key shapes:

```typescript
// Root type
ResumeData {
  personalInfo: PersonalInfo
  profile: { summaryText: string }
  skills: SkillCategory[]
  experience: WorkEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  languages: LanguageEntry[]
  certifications: CertEntry[]
}

// Section ordering
SectionKey = 'profile' | 'skills' | 'experience' | 'education' | 'projects' | 'languages' | 'certifications'
```

---

## 6. Template 1 — Visual Specification

> Source file: `src/templates/source/template-1-clean.docx`
> Output component: `src/templates/template-1/Template1.tsx`

This template was reverse-engineered from the `.docx` file. These values are locked — do not change them without user instruction.

| Element | Tailwind classes / value |
|---------|--------------------------|
| Template width | `w-[816px]` (US Letter at 96dpi) |
| Outer padding | `p-10` |
| Background | `bg-white` |
| Base font | `font-sans text-[11px]` |
| Name (header) | `text-[20px] font-normal text-center` |
| Contact lines | `text-[11px] text-center` — email in `italic` |
| Section headers | `text-[13px] font-normal text-[#1155CC] border-b border-[#1155CC] pb-0.5 mb-1 mt-3` |
| Section header weight | **NOT bold** — `font-normal` matches the `.docx` Heading 2 style |
| Job title + company | `flex justify-between font-bold` |
| Dates | Right-aligned, `font-bold` |
| Location under job | `text-[10px] italic text-gray-600` |
| Bullet points | `list-disc list-inside` |
| Skill bullets | `font-bold` category name + colon, then plain skills text |
| Education row | `flex justify-between` — degree+field bold, institution plain |
| Project row | `flex justify-between` — title bold, date bold right |
| Cert row | `flex justify-between` — name plain, date bold right |
| Empty field placeholder | `text-gray-300 italic` |

**Section render order (do not change):**
1. Header (personalInfo)
2. Profile
3. Skills & Technologies
4. Work Experience
5. Education
6. Projects & Extra
7. Languages
8. Certifications

---

## 7. State Management Rules (Zustand)

- The store is defined in `src/store/resumeStore.ts` and exported as `useResumeStore`
- **Only form components** in `src/components/editor/` read from or write to the store
- **Template components** in `src/templates/` never import the store — they receive `data: ResumeData` as a prop
- **Page components** read `resumeData` from the store and pass it down as props to templates
- Preview debounce: 300ms — implemented in the editor page, not in the store
- Store uses `immer` middleware for all state mutations — use draft mutations, not spreads

---

## 8. Rich Text Editor Rules (TipTap)

The TipTap editor in `src/components/editor/RichTextEditor.tsx` supports **only** these extensions:

- `Bold`
- `Italic`
- `Underline`
- `BulletList` (unordered, Level 1)
- `BulletList` nested (Level 2 only)

**Do not add:** `Heading`, `OrderedList`, `Color`, `FontFamily`, `Strike`, `Code`, `Link`, or any other extension. The output must remain ATS-safe.

TipTap output is stored as an **HTML string** in the Zustand store. When rendering in `Template1.tsx`, use `dangerouslySetInnerHTML` only for fields that came from the rich text editor (bullet points in Work Experience).

---

## 9. Phase Rules

### Phase 1 — Resume Builder (Current)
**Branch:** `phase-1/resume-builder`

In scope:
- Landing page (`src/app/page.tsx`)
- Template selection (`src/app/(resume-builder)/templates/page.tsx`)
- Split-screen editor (`src/app/(resume-builder)/editor/page.tsx`)
- Accordion form panel (`src/components/editor/`)
- Template 1 display component (`src/templates/template-1/Template1.tsx`)
- Zustand store (`src/store/resumeStore.ts`)
- Download — `.docx` and `.pdf` (`src/lib/exportResume.ts`)
- `useScaleToFit` hook (`src/hooks/useScaleToFit.ts`)

Out of scope — do not build, stub, or reference these in Phase 1:
- Anything in `src/components/word-cloud/` or `src/components/score/`
- Any `backend/` code
- `react-dropzone`, `mammoth`, `react-wordcloud`, `d3-cloud`
- The keyword-scoring page (`src/app/keyword-scoring/`)

The "Score My Resume" card on the landing page must exist but be **visually disabled** with a "Coming Soon" badge. No route or logic behind it in Phase 1.

### Phase 2 — Keyword Scoring (Active)
**Branch:** `phase-2/keyword-scoring` (branch off `develop` after Phase 1 merges)

Do not write any Phase 2 code during a Phase 1 session. If you identify something that would help Phase 2, add a `// TODO Phase 2:` comment and move on.

---

## 10. Error Handling Standards

- **Frontend:** All errors shown as toast notifications or inline banners — never raw error objects or `console.error` messages visible to users
- **Backend:** All FastAPI endpoints return structured JSON errors with a `detail` field — never Python tracebacks
- **File upload errors** (wrong type, oversized): caught client-side before the request is sent
- **Parse failure (Phase 2):** Red error banner with exact wording from PRD Section 7.3
- **Partial parse (Phase 2):** Amber warning banner + amber field highlighting — exact wording from PRD Section 7.3
- **API unreachable:** Error banner with a retry button — no automatic retries

---

## 11. Git Workflow

```
main                        ← protected, production-ready
└── develop                 ← integration branch, always working
    ├── phase-1/resume-builder    ← current Phase 1 work
    └── phase-2/keyword-scoring   ← starts after Phase 1 merges
```

### Commit message format
```
<type>: <short description>

Types:
  feat     → new feature
  fix      → bug fix
  chore    → config, deps, folder structure
  refactor → code change with no behaviour change
  style    → Tailwind/CSS only changes
  test     → tests only
  docs     → documentation only
```

### Commit checkpoints — commit after every session
```bash
git add .
git commit -m "feat: <what was built>"
git push origin phase-1/resume-builder
```

### Phase 1 release sequence (when all 5 sessions complete)
```bash
git checkout develop
git merge phase-1/resume-builder
git push origin develop
git checkout main
git merge develop
git tag v1.0.0-resume-builder
git push origin main --tags
```

---

## 12. Agent Session Checklist

Run through this before starting every session:

```
□ What is the ONE deliverable for this session? (state it before writing)
□ Have I read src/types/resume.ts?
□ Have I checked the file structure in Section 2 to confirm where output goes?
□ Am I on the correct git branch? (run: git branch)
□ Have I re-indexed @Codebase / Graphify since the last session?
□ Does this session touch Phase 2 scope? (if yes — stop, check with user)
□ Will I need to install any packages? (if yes — stop, tell user first)
```

---

## 13. What Cursor Does vs What Antigravity Does

| Task | Tool | Why |
|------|------|-----|
| TypeScript type definitions (`resume.ts`) | **Cursor** | Precision task, exact field names matter |
| Template conversion `.docx` → `Template1.tsx` | **Cursor** | Requires visual spec knowledge, gets it right in fewer tokens |
| Sample data file (`sampleData.ts`) | **Cursor** | Small, quick, follows directly from types |
| Template preview page | **Cursor** | Simple, completes the Cursor session cleanly |
| Zustand store | **Antigravity** | Logic-heavy, benefits from full codebase context |
| Accordion editor components | **Antigravity** | Multi-file output, Antigravity handles well |
| Split-screen editor page | **Antigravity** | Wires components together — needs store + template awareness |
| Download feature | **Antigravity** | Two export formats, non-trivial logic |
| Landing page + template selection | **Antigravity** | Routing + state init, straightforward after prior sessions |
| All Phase 2 work (backend + NLP) | **Antigravity** | Python backend, multi-service, long sessions |

---

## 14. Token-Saving Rules

These rules exist specifically to reduce token consumption across sessions.

1. **Start every prompt with `@Codebase`** (Cursor) or "Read the knowledge graph" (Antigravity) — this lets the agent read structure instead of you explaining it
2. **Never paste file contents into a prompt** — reference the file path instead (`"read src/store/resumeStore.ts"`)
3. **One session = one file or one folder** — splitting sessions by file prevents context bleed and repeat reading
4. **Commit before switching tools** — switching from Cursor to Antigravity mid-feature creates confusion and re-explanation cost
5. **Use the exact section headings from this file** when describing a task — the agent can cross-reference without elaboration
6. **Never ask the agent to explain its plan** before writing — go straight to code; review after
7. **Re-index @Codebase after every session** — stale index = agent reads old file contents = wasted tokens on outdated context
8. **Do not ask the agent to write tests in Phase 1** — manual QA via the checklist in the Action Plan (Section 5.6) is sufficient and token-free

---

## 15. Key Decisions Log

These decisions are final for v1. Do not re-open them.

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth in v1 | None — session-based only | Reduces scope, no DB needed |
| Template count | 1 real + 2 "Coming Soon" | Templates 2 and 3 deferred to v2 |
| Accordion expand mode | Multi-expand | More flexible for users |
| Preview debounce | 300ms on store update | Prevents render thrashing on fast typing |
| Rich text scope | Bold, Italic, Underline, Bullets (2 levels) only | ATS safety |
| Score algorithm | Semantic similarity (cosine on sentence-transformer embeddings) | More meaningful than keyword match |
| Word cloud | Static — generated once from JD, does not update | Simpler, Phase 2 scope |
| Score refresh scope | Re-runs cosine similarity on current resume vs stored JD embedding only | No full NLP re-run on refresh |
| Resume upload formats | `.docx` and `.pdf` | Covers majority of real-world use |
| Export formats | `.docx` and `.pdf` | Standard professional formats |
| Mobile support | Out of scope for v1 — must not break below 768px | Deferred |
| Backend database | None in v1 | Session state only |

---

*AGENTS.md — Resume Builder · v1.0 · Maintained alongside `docs/Resume_Builder_PRD_v2.docx`*
*Update this file whenever a decision changes, a new session scope is defined, or a Phase 2 session begins.*