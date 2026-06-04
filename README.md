# Resume Builder

An AI-powered resume builder with intelligent keyword scoring and job description analysis. Built with a Next.js frontend and a FastAPI backend, the app allows users to create, edit, and export polished resumes — then benchmark them against any job description using semantic similarity and keyword alignment.

> **Live app coming soon.** The web deployment will go live after the LLM fine-tuning work planned for Phase 2 is complete.

---

## Features

**Resume Editor**
- Section-by-section accordion editor covering personal info, work experience, education, skills, projects, languages, and certifications
- Rich text editing via TipTap for bullet-point accomplishments
- Drag-and-drop reordering of resume sections
- Live preview against a professional template
- Export to PDF and DOCX

**Keyword Scoring** *(Phase 2 — active)*
- Paste any job description and get a 0–100 match score against your resume
- Hybrid scoring: dense semantic similarity (sentence embeddings) combined with weighted lexical keyword alignment
- Word cloud visualisation of the top JD keywords, sized by frequency and NLP-extracted entity weight
- Ranked keyword list showing which terms are present or missing from your resume

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework and routing |
| TypeScript (strict) | Type safety |
| Tailwind CSS | Styling — utility classes only |
| Zustand | Global resume state management |
| TipTap | Rich text editor for bullet points |
| react-pdf / @react-pdf/renderer | PDF generation and preview |
| docx | DOCX export |
| react-wordcloud | Word cloud visualisation |

### Backend
| Package | Purpose |
|---|---|
| FastAPI | API framework |
| Pydantic v2 | Request/response schema validation |
| python-docx | DOCX resume parsing |
| pdfplumber | PDF resume parsing |
| sentence-transformers | Semantic embeddings for scoring |
| spaCy (`en_core_web_sm`) | NLP — entity and keyword extraction |
| wordcloud + Pillow | Word cloud PNG generation |
| uvicorn | ASGI server |

---

## Project Structure

```
resume-builder/
├── backend/
│   ├── main.py                  # FastAPI app, lifespan, health check
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response models
│   ├── routers/
│   │   ├── parse.py             # POST /parse — resume upload endpoint
│   │   └── score.py             # POST /score, POST /wordcloud
│   └── services/
│       ├── parser.py            # PDF and DOCX parsing logic
│       ├── scorer.py            # Hybrid semantic + lexical scoring
│       └── wordcloud_gen.py     # Keyword extraction and PNG generation
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (resume-builder)/
    │   │   │   ├── editor/      # Main resume editor page
    │   │   │   └── templates/   # Template selection page
    │   │   ├── keyword-scoring/ # JD scoring page
    │   │   └── template-preview/
    │   ├── components/
    │   │   ├── editor/          # AccordionPanel, all section forms, RichTextEditor
    │   │   ├── score/           # KeywordScoreWidget
    │   │   └── word-cloud/      # WordCloudDisplay
    │   ├── lib/
    │   │   ├── api/             # keywordScoringApi.ts — backend API calls
    │   │   ├── pdf/             # ResumePdfDocument.tsx
    │   │   └── exportResume.ts  # DOCX and PDF export helpers
    │   ├── store/
    │   │   └── resumeStore.ts   # Zustand store — single source of truth
    │   ├── templates/
    │   │   └── template-1/      # Template1.tsx, sampleData.ts
    │   └── types/
    │       └── resume.ts        # Shared TypeScript types
    └── AGENTS.md                # Agentic coding guidelines for this repo
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/parse` | Upload a PDF or DOCX resume — returns structured `ResumeParseResponse` |
| `POST` | `/wordcloud` | Generate a word cloud PNG (base64) and ranked keyword list from a JD |
| `POST` | `/score` | Score a resume against a cached JD embedding (0–100) |

### Key response models

**`ResumeParseResponse`** — full parsed resume broken into typed sections:
personal info, work entries, education entries, skill categories, projects, languages, and certifications.

**`KeywordScoreResponse`** — overall match score plus per-keyword presence flags.

**`WordCloudResponse`** — base64-encoded PNG and a ranked `KeywordItem` list (term + frequency weight).

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- `pip` and a virtual environment tool

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to the backend on port `8000`.

---

## Roadmap

### Phase 1 — Resume Builder ✅
- [x] Section editor with drag-and-drop reordering
- [x] Rich text bullet points via TipTap
- [x] PDF and DOCX export
- [x] Live template preview
- [x] PDF and DOCX resume parsing (upload-to-edit flow)

### Phase 2 — Keyword Scoring 🚧
- [x] Word cloud generation from job descriptions
- [x] Hybrid semantic + lexical scoring engine
- [ ] LLM fine-tuning for improved keyword extraction and scoring accuracy
- [ ] Web deployment (goes live after fine-tuning is complete)

---

## Data Model

The core resume type used throughout the frontend and backend:

```typescript
type ResumeData = {
  personalInfo: PersonalInfo       // name, contact details, links
  workExperience: WorkEntry[]      // role, company, dates, location, bullets
  education: EducationEntry[]      // degree, field, school, year range
  skills: SkillCategory[]          // grouped skill lists
  projects: ProjectEntry[]         // optional projects section
  languages: LanguageEntry[]       // language + proficiency + CEFR level
  certifications: CertEntry[]      // cert name, issuer, date
}
```

---

## Contributing

Branch strategy:

```
main          ← protected, production-ready
develop       ← integration branch
feature/*     ← one branch per task
```

Commit message format:

```
<type>: <short description>

Types: feat | fix | refactor | style | docs | chore
```

---
