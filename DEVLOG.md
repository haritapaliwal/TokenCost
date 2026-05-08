# DEVLOG — AI Spend Audit

---

## Day 1 — 2026-05-07

### What I did today

**Morning: Project scaffolding**

- Initialized a new Next.js 14 app with TypeScript, Tailwind CSS, and the App Router using `create-next-app@latest`. Chose this stack because Next.js + TypeScript is the industry standard for production SaaS.
- Set up **Prettier** (`.prettierrc`) and **Husky** with **lint-staged** to block bad commits at the source.
- Created `.github/workflows/ci.yml` to run linting, type-checks, and tests on every push.

**Afternoon: Pricing research**

- Researched official pricing for all 8 tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.
- Recorded everything in `PRICING_DATA.md` with source URLs and API token costs.

**Evening: Architecture + planning**

- Wrote `ARCHITECTURE.md` with a Mermaid system diagram and data flow.
- Configured **Supabase** and **Resend** as our backend and email providers.

---

## Day 2 — 2026-05-08

### What I did today

**Morning: Spend Input Form**

- Created `SpendForm.tsx` with a responsive multi-tool UI.
- Implemented tool selection grid (8 tools) and dynamic input rows for detailed data.
- Added **localStorage persistence** via a custom `useLocalStorage` hook. The form now pre-fills on reload, ensuring zero data loss for users.
- Built-in validation: Ensures at least one tool is selected and all plan/seat data is valid before allowing an audit.

**Afternoon: Audit Engine**

- Created `lib/auditEngine.ts` as a pure, deterministic TypeScript library.
- Implemented hardcoded optimization rules:
  - **Plan-size checks**: e.g., Cursor Business ($40) for 1 user → Cursor Pro ($20).
  - **Cross-tool checks**: e.g., ChatGPT Team for a solo coder → GitHub Copilot Individual ($10).
  - **API optimizations**: Recommending Gemini 1.5 Flash for high-volume general reasoning tasks to replace expensive GPT-4o/Claude Opus calls.
- Every recommendation includes a human-readable "reason" string to satisfy the requirement for transparency.

**Evening: Testing & Refinement**

- Set up **Jest** and **Testing Library** for the project.
- Wrote unit tests in `__tests__/auditEngine.test.ts` covering edge cases: solo users on team plans, already-optimal plans, and high-volume API migrations.
- Verified that `npm test` passes and will be caught by the CI workflow.
- Updated the Home page UI to be more premium with Lucide icons and a clean Tailwind layout.

### What I'm still figuring out

- Designing the "Results Page" layout — need to make the savings number look impressive.

### Commits today

```
feat: add multi-tool spend input form with localStorage persistence
feat: implement audit engine with per-tool recommendation logic
test: add audit engine unit tests for plan-size and cross-tool cases
docs: update DEVLOG with Day 2 entry
```

---

_Next up: Day 3 — Results Page, Shareable UUIDs, and Supabase Integration._
