# ARCHITECTURE.md

## What this system does (one paragraph)

A visitor inputs their AI tool subscriptions (plan, seats, monthly spend, use case). The
frontend runs a deterministic audit engine locally — no server round-trip needed — and
produces per-tool recommendations with savings figures. That audit payload is then sent
to a Next.js API route, which persists it to Supabase, triggers an Anthropic API call for
a personalized summary paragraph, and returns a unique shareable UUID. A second API
route handles email lead capture with honeypot abuse protection. The shareable
`/audit/[id]` page strips PII and serves Open Graph meta tags for social previews.

---

## System diagram

```mermaid
flowchart TD
    A([Visitor]) --> B[Landing page\n/]

    B --> C[Spend input form\nTools · Plans · Seats · Use case]
    C -->|localStorage| C

    C --> D{Audit engine\nlib/auditEngine.ts}

    D --> E[Per-tool recommendations\ncurrentSpend → action → savings]
    E --> F[Results page\n/audit/new]

    F --> G[/api/create-audit\nPOST/]

    G --> H[(Supabase\naudits table\ntools + savings — no PII)]
    G --> I[/api/generate-summary\nPOST/]

    I --> J[Anthropic API\nclaude-sonnet-4-20250514]
    J -->|~100-word paragraph| I
    I -->|fallback on error| K[Templated summary\nbuilt from audit data]
    I --> F

    F --> L{Savings threshold}
    L -->|"> $500/mo"| M[Credex CTA\nBook consultation]
    L -->|"< $100/mo or optimal"| N[You're spending well\nNotify me signup]

    F --> O[Share button\nUnique URL copied]
    O --> P[/audit/id\nPublic shareable page\nPII stripped · OG tags]

    F --> Q[Email gate\nValue shown first]
    Q --> R[/api/capture-lead\nPOST/]
    R --> S{Abuse check}
    S -->|Honeypot filled| T[Silently drop]
    S -->|Rate limit hit| U[429 response]
    S -->|Clean| V[(Supabase\nleads table\nemail · company · role)]
    V --> W[Resend\nTransactional email\nAudit summary + Credex note]

    style A fill:#f0f0f0,stroke:#999
    style J fill:#D4EBF9,stroke:#185FA5
    style H fill:#D1F5E4,stroke:#0F6E56
    style V fill:#D1F5E4,stroke:#0F6E56
    style M fill:#FAEEDA,stroke:#BA7517
```

---

## Data flow: input → audit result

```
1. User fills form
   └─ React state + localStorage (persists across reloads)

2. "Run Audit" clicked
   └─ auditEngine.ts runs synchronously in the browser
      ├─ Input: { tool, plan, seats, monthlySpend, useCase }[]
      └─ Output: { tool, currentSpend, action, savings, reason }[]
                 + totalMonthlySavings + totalAnnualSavings

3. Results rendered immediately (no server wait)

4. Async: POST /api/create-audit
   └─ Saves audit to Supabase → returns { id: UUID }
   └─ POST /api/generate-summary
      └─ Calls Anthropic API with audit payload
      └─ Returns ~100-word paragraph (or fallback on failure)
      └─ Summary rendered when ready (skeleton shown meanwhile)

5. Shareable URL constructed: /audit/{UUID}
   └─ Supabase query returns audit (PII excluded)
   └─ generateMetadata() builds OG + Twitter Card tags

6. Email capture (optional, after value shown)
   └─ POST /api/capture-lead
      ├─ Honeypot check
      ├─ Rate limit check (5 req/hour per IP via Upstash)
      └─ Write to leads table → trigger Resend email
```

---

## Why this stack

| Choice                                       | Reason                                                                        | Trade-off accepted                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Next.js 14 (App Router)**                  | API routes, SSR for OG tags, and `generateMetadata()` all in one repo         | Slightly more complex than Vite+Express, but worth it for OG |
| **TypeScript**                               | Audit engine logic has many edge cases — types catch mistakes at compile time | Slower to write initially                                    |
| **Tailwind CSS**                             | Fast iteration on the results page UI; no unused CSS in prod                  | Utility class soup in JSX                                    |
| **Supabase**                                 | Row-level security, SQL data model, free tier generous                        | More setup than Firebase, worth it for structured queries    |
| **Resend**                                   | 3000 free emails/month, excellent Next.js SDK, deliverability good            | Can't do drip sequences on free tier                         |
| **Anthropic API (claude-sonnet-4-20250514)** | Best reasoning for nuanced spend advice; already in the Credex ecosystem      | Cost per audit (~$0.003); acceptable at this scale           |
| **Upstash Redis**                            | Serverless-compatible rate limiting without managing infrastructure           | Adds one more service dependency                             |
| **Vercel**                                   | Zero-config Next.js deploy, automatic preview URLs per branch                 | Vendor lock-in; acceptable for a tool at this stage          |

**Why not use AI for the audit engine logic?**
The audit recommendations must be deterministic and auditable. A finance person needs to
read the reasoning and agree with it. LLMs can hallucinate numbers. Hardcoded rules with
cited pricing data are the correct choice here — and the brief explicitly tests whether
candidates know this.

---

## What changes at 10,000 audits/day

| Current (MVP)                       | At scale                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Anthropic API called per audit      | Add a Redis cache keyed on audit hash — identical tool/plan combos reuse the same summary              |
| Supabase free tier (500MB)          | Upgrade to Pro; add a read replica for the `/audit/[id]` public page (read-heavy)                      |
| Rate limiting via Upstash in-memory | Move to a distributed token bucket; add hCaptcha for the email form                                    |
| No queue for lead emails            | Add a BullMQ job queue on Render so email failures are retried                                         |
| Single Vercel region                | Enable Vercel Edge Network; move audit creation to an Edge Function                                    |
| OG images are static                | Add `@vercel/og` to generate dynamic OG images with the savings number baked in                        |
| No monitoring                       | Add Sentry for error tracking; Axiom for log aggregation; simple Grafana dashboard on Supabase metrics |
