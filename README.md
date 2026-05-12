# AI Spend Audit Platform

**Optimize Your Team's AI Costs in 60 Seconds.**

Live Demo: [https://token-cost-ochre.vercel.app](https://token-cost-ochre.vercel.app)

AI Spend Audit is a B2B lead-generation tool built for **Credex**. It helps startups and engineering managers identify waste in their AI tool stack (Cursor, Copilot, Claude, ChatGPT) and provides deterministic recommendations to save thousands of dollars per month.

---

## 🚀 Key Features

- **Deterministic Audit Engine**: No AI guesswork. Uses hard-coded May 2026 pricing logic to find exact savings.
- **AI Narrative Summaries**: Uses Claude 3.5 Sonnet to provide human-friendly explanations of complex pricing waste.
- **Lead Capture & Shareability**: Generate unique URLs to share results with finance teams and save reports to your inbox via Resend.
- **High Performance**: Lighthouse scores: 92 Performance, 96 Accessibility, 100 Best Practices, 100 SEO.

---

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/haritapaliwal/TokenCost.git
cd ai-spend-audit
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file with the following:

```env
# Anthropic for AI Summaries
ANTHROPIC_API_KEY=your_key

# Supabase for persistence
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Resend for transactional emails
RESEND_API_KEY=your_key

# App URL for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Locally

```bash
npm run dev
```

---

## 📐 Decisions & Trade-offs

1. **Next.js 15 + Turbopack**: Chosen for bleeding-edge performance and developer experience. _Trade-off:_ Required refactoring dynamic routes to handle new asynchronous `params` requirements.
2. **Supabase over Firebase**: Used for its clean SQL schema and Row-Level Security (RLS) which made the `audits` and `leads` relationship more robust. _Trade-off:_ Slightly steeper setup curve than a NoSQL alternative.
3. **Client-Side Audit Engine**: The core calculation logic runs locally in the browser for zero-latency feedback. _Trade-off:_ Pricing logic is exposed in client-side JS bundles.
4. **Resend for Transactional Emails**: Selected for its superior developer experience and template management. _Trade-off:_ Free tier limits usage to 3,000 emails per month.
5. **Vanilla CSS + Lucide Icons**: Prioritized a custom, premium design over generic UI libraries. _Trade-off:_ More manual CSS maintenance required compared to Tailwind/UI-kit defaults.

---

## 📄 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical system design.
- [DEVLOG.md](./DEVLOG.md) - Day-by-day development progress.
- [GTM.md](./GTM.md) - Go-to-market strategy and personas.
- [ECONOMICS.md](./ECONOMICS.md) - Unit economics and funnel math.
- [TESTS.md](./TESTS.md) - Test coverage and run instructions.
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) - Real-world founder conversations.
- [REFLECTION.md](./REFLECTION.md) - Post-project reflection and self-assessment.
