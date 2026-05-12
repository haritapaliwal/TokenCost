# REFLECTION.md — Project Reflection

### Q1 — Hardest bug

The hardest bug was the **Next.js 15 async `params` breaking the dynamic audit route**. In Next.js 15+, `params` in dynamic routes is a Promise that must be awaited. My original implementation accessed `params.id` synchronously, causing the production build to fail or return 404s. I first suspected a Supabase connection issue, but server logs showed the ID was `undefined`. After checking the Next.js 15 migration guide, I realized the change. I refactored the page to `async` and awaited the params, which fixed the issue.

### Q2 — Decision reversed

I initially planned to **gate the entire audit result behind an email capture form**. I thought this would maximize lead generation. However, after testing the flow, I realized that users had zero trust in the tool's value before seeing the number. I reversed this decision and moved the results to the top of the fold, making them instant and free. The email capture was moved to a "Save your report" section at the bottom. This significantly improved the "Aha!" moment and likely increased the shareability of the tool.

### Q3 — Week 2 build

If I had a second week, I would build a **Browser Extension (Chrome/Arc)** that auto-detects AI spending. It would trigger when a user visits the "Billing" or "Subscription" pages of Claude, OpenAI, or Cursor, and offer to "Import to Audit" automatically. This would eliminate the friction of manual data entry, which is the #1 reason users drop off before completing the audit. Making it "1-click" would drastically increase the volume of leads for Credex.

### Q4 — AI tool usage

I used **Claude 3.5 Sonnet** for generating the narrative summaries and **v0** for initial UI component skeletons. I didn't trust the AI with the **deterministic pricing logic** (the actual math). One specific instance: I asked the AI to generate a summary for a team of 5 on Cursor, and it suggested they switch to "Cursor Free" to save money, ignoring the fact that a team of 5 _requires_ a paid plan for collaborative features. I caught this because my unit tests for the `auditEngine.ts` flagged the logic error. I fixed it by providing the AI with a strict "Fact Sheet" of pricing rules in the system prompt.

### Q5 — Self-ratings (1–10)

- **Discipline: 9/10** — I maintained a daily devlog, followed a strict 7-day schedule, and never skipped a commit window.
- **Code Quality: 8/10** — I used TypeScript strictly, implemented a robust test suite, and followed Next.js 15 best practices.
- **Design Sense: 9/10** — The UI feels premium, uses modern aesthetics (glassmorphism), and is fully accessible (96/100 score).
- **Problem Solving: 8/10** — I successfully debugged complex deployment and runtime issues (Next.js 15 params, Supabase RLS).
- **Entrepreneurial Thinking: 9/10** — I focused heavily on the business value for Credex (lead-gen funnel, economics) rather than just building a "calculator."
