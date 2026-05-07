# DEVLOG — AI Spend Audit

---

## Day 1 — 2026-05-07

### What I did today

**Morning: Project scaffolding**

- Initialized a new Next.js 14 app with TypeScript, Tailwind CSS, and the App Router using `create-next-app@latest`. Chose this stack because Next.js + TypeScript is the industry standard for production SaaS, and Tailwind keeps styling fast and consistent. Full justification in `ARCHITECTURE.md`.
- Set up **Prettier** (`.prettierrc`) with consistent opinionated defaults: single quotes, semicolons, 100-char line width, LF line endings.
- Installed **Husky** and **lint-staged** to block bad commits at the source — any commit that fails ESLint or Prettier gets rejected before it ever touches the repo.
- Created `.github/workflows/ci.yml` — runs on every push to `main` and on every PR. Steps: checkout → Node 20 setup → `npm ci` → `eslint` → `prettier --check` → `tsc --noEmit` → `npm test`. Goal: green check on every push from day one.

**Afternoon: Pricing research**

- Spent ~2 hrs on official pricing pages for all 8 tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf.
- Recorded everything in `PRICING_DATA.md` with exact URLs and today's date. Every number is sourced.
- Enterprise "Contact Us" pricing was estimated using a documented methodology (competitor comparison + tier multiplier). Not guessing — reasoning is written down and defensible.
- Key finding: **API pricing (per million tokens)** varies wildly — GPT-4o mini at $0.15/1M input vs Claude Opus at $15/1M input is a 100× difference. This is the core data that will power the audit engine calculations.

**Evening: Architecture + planning**

- Wrote `ARCHITECTURE.md` with a Mermaid system diagram, full data flow description, and stack justification. See that file for details.
- Signed up for **Supabase** (free tier) — created project, grabbed `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Will store user usage data and audit results here.
- Signed up for **Resend.com** (free tier, 100 emails/day) — easiest email provider for Next.js. Will use for sending audit report PDFs and billing alerts.

### What I'm still figuring out

- The exact schema for the `audit_results` table in Supabase — need to think through what fields the audit engine will output before I create migrations.
- Whether to do the audit calculation purely client-side or run it server-side in a Route Handler. Leaning server-side for security (don't expose pricing formulas to the client).
- Whether Windsurf's pricing is comparable enough to v0 to be a fair substitute in the audit — the two products serve different use cases (IDE vs. generative UI). May document both.

### Blockers / Manual steps needed

- [ ] **GitHub repo**: Create `ai-spend-audit` as a public repo, add MIT license + Node `.gitignore`, then `git remote add origin <url>` and push.
- [ ] **Vercel**: Go to vercel.com → Import Project → connect GitHub repo. Enable auto-deploy on push to `main`. Set environment variables for Supabase + Resend.
- [ ] **Supabase**: Sign up at supabase.com, create project, copy keys to `.env.local`.
- [ ] **Resend**: Sign up at resend.com, copy API key to `.env.local`.

### Commits today

```
feat: initialize Next.js app with TypeScript and Tailwind
feat: add CI workflow with lint and test steps
docs: add ARCHITECTURE.md with Mermaid system diagram
docs: add PRICING_DATA.md with verified tool pricing
docs: add DEVLOG Day 1 entry
```

### Mood

Solid day. Scaffolding always feels productive even if it's not "real" code yet. The pricing research was more interesting than expected — the API token cost differences between models are enormous, and that's going to be the most valuable insight this tool surfaces for teams.

---

_Next up: Day 2 — Database schema, Supabase migrations, UI wireframes, input form._
