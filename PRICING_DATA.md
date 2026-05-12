# AI Tool Pricing Data

> **Recorded:** 2026-05-07 | **Author:** ai-spend-audit project
> All prices are in USD. Verified from official pricing pages on this date.

---

## 1. Cursor

**URL:** https://cursor.com/pricing

| Plan       | Price          | Notes                                      |
| ---------- | -------------- | ------------------------------------------ |
| Hobby      | Free           | 2,000 completions/month, 50 slow requests  |
| Pro        | $20/month      | Unlimited completions, 500 fast requests   |
| Teams      | $40/user/month | Team features, admin controls, SSO         |
| Enterprise | Contact Us     | Estimated ~$60–80/user/month based on comp |

**API pricing:** N/A — Cursor proxies models, billed at plan level.

---

## 2. GitHub Copilot

**URL:** https://github.com/features/copilot#pricing

| Plan       | Price                  | Notes                                                |
| ---------- | ---------------------- | ---------------------------------------------------- |
| Free       | Free                   | 2,000 completions + 50 chat req/month (students/OSS) |
| Individual | $10/month or $100/year | Unlimited suggestions, chat in IDE                   |
| Business   | $19/user/month         | Policy management, audit logs                        |
| Enterprise | $39/user/month         | Org-wide knowledge, fine-tuning                      |

**API pricing:** N/A — not directly API-priced.

---

## 3. Claude (Anthropic — claude.ai)

**URL:** https://claude.ai/upgrade

| Plan       | Price          | Notes                                       |
| ---------- | -------------- | ------------------------------------------- |
| Free       | Free           | Claude 3.5 Sonnet, limited usage            |
| Pro        | $20/month      | 5× more usage, Projects, early access       |
| Team       | $25/user/month | Min 5 users, shared Projects, admin         |
| Enterprise | Contact Us     | Estimated $40–60/user/month (industry comp) |

---

## 4. ChatGPT (OpenAI — consumer product)

**URL:** https://openai.com/chatgpt/pricing/

| Plan       | Price          | Notes                                         |
| ---------- | -------------- | --------------------------------------------- |
| Free       | Free           | GPT-4o mini, limited GPT-4o access            |
| Plus       | $20/month      | GPT-4o, DALL·E, Advanced Data Analysis        |
| Team       | $25/user/month | Min 2 users, shared workspace, more cap       |
| Pro        | $200/month     | Unlimited GPT-4o, o1 Pro, extended features   |
| Enterprise | Contact Us     | Estimated $50–70/user/month (SSO, audit logs) |

---

## 5. Anthropic API (Claude API)

**URL:** https://www.anthropic.com/pricing

| Model             | Input (per 1M tokens) | Output (per 1M tokens) |
| ----------------- | --------------------- | ---------------------- |
| Claude 3.5 Haiku  | $0.80                 | $4.00                  |
| Claude 3.5 Sonnet | $3.00                 | $15.00                 |
| Claude 3 Opus     | $15.00                | $75.00                 |
| Claude 3.7 Sonnet | $3.00                 | $15.00                 |

**Context window:** Up to 200K tokens. Prompt caching available (90% discount on cached tokens).

---

## 6. OpenAI API

**URL:** https://openai.com/api/pricing/

| Model         | Input (per 1M tokens) | Output (per 1M tokens) | Notes                |
| ------------- | --------------------- | ---------------------- | -------------------- |
| GPT-4o        | $2.50                 | $10.00                 | Cached: $1.25 input  |
| GPT-4o mini   | $0.15                 | $0.60                  | Cached: $0.075 input |
| o1            | $15.00                | $60.00                 |                      |
| o1-mini       | $1.10                 | $4.40                  |                      |
| GPT-3.5 Turbo | $0.50                 | $1.50                  |                      |

**Image generation (DALL·E 3):** $0.040–$0.120 per image depending on quality/size.

---

## 7. Google Gemini (Consumer + API)

**URL (consumer):** https://one.google.com/about/ai-premium
**URL (API):** https://ai.google.dev/pricing

### Consumer Plans

| Plan                  | Price        | Notes                                    |
| --------------------- | ------------ | ---------------------------------------- |
| Free                  | Free         | Gemini 1.5 Flash, limited Gemini 1.5 Pro |
| Google One AI Premium | $19.99/month | Gemini Advanced (Ultra 1.0), 2TB storage |

### Gemini API Pricing (per 1M tokens)

| Model            | Input  | Output | Notes                    |
| ---------------- | ------ | ------ | ------------------------ |
| Gemini 1.5 Flash | $0.075 | $0.30  | Free tier: 15 req/min    |
| Gemini 1.5 Pro   | $1.25  | $5.00  | ≤128K ctx; 2× for longer |
| Gemini 1.0 Pro   | $0.50  | $1.50  |                          |
| Gemini 2.0 Flash | $0.10  | $0.40  | Latest, multimodal       |

---

## 8. Windsurf (Codeium)

**URL:** https://codeium.com/pricing

| Plan       | Price          | Notes                                       |
| ---------- | -------------- | ------------------------------------------- |
| Free       | Free           | Basic autocomplete, limited chat            |
| Pro        | $15/month      | Unlimited flows, GPT-4o + Claude access     |
| Teams      | $35/user/month | Admin, SSO, shared context                  |
| Enterprise | Contact Us     | Estimated $50–70/user/month (SOC2, on-prem) |

**Note:** Windsurf (by Codeium) is the closest equivalent to v0 in the IDE-native agentic coding space. Pricing estimated for enterprise based on comparable SaaS AI tooling (Cursor Enterprise, GitHub Copilot Enterprise).

---

## Enterprise Pricing Estimates — Methodology

For tools with "Contact Us" enterprise pricing, estimates are derived by:

1. Checking public Glassdoor/LinkedIn/G2 reviews mentioning pricing
2. Comparing to competitors with published enterprise pricing
3. Applying a 1.5–2× multiplier on the highest published tier

These are **defensible estimates, not verified quotes.** All estimates are labeled as such.

---

## Summary Table

| Tool              | Free? | Cheapest Paid | Mid-tier (Team) | API Available? |
| ----------------- | ----- | ------------- | --------------- | -------------- |
| Cursor            | ✅    | $20/mo        | $40/user/mo     | ❌             |
| GitHub Copilot    | ✅    | $10/mo        | $19/user/mo     | ❌             |
| Claude (consumer) | ✅    | $20/mo        | $25/user/mo     | ✅             |
| ChatGPT           | ✅    | $20/mo        | $25/user/mo     | ✅             |
| Anthropic API     | ✅    | Pay-as-you-go | —               | ✅             |
| OpenAI API        | ✅    | Pay-as-you-go | —               | ✅             |
| Gemini            | ✅    | $19.99/mo     | —               | ✅             |
| Windsurf          | ✅    | $15/mo        | $35/user/mo     | ❌             |
