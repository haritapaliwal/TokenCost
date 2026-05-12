# ECONOMICS.md — Unit Economics Breakdown

## What Is a Converted Lead Worth to Credex?

### Assumptions (Conservative)

| Variable                       | Value                     | Source                                 |
| ------------------------------ | ------------------------- | -------------------------------------- |
| Average Credex credit purchase | $200/mo                   | Based on typical AI API credit bundles |
| Gross margin on credits        | 25%                       | Typical reseller margin                |
| Average customer lifetime      | 8 months                  | B2B SaaS benchmark for SMB             |
| LTV per customer               | $200 × 25% × 8 = **$400** |                                        |

**One converted lead = $400 LTV (conservative)**

---

## Conversion Funnel

| Stage                                 | Conversion Rate | Assumption                                    |
| ------------------------------------- | --------------- | --------------------------------------------- |
| Visit site → Audit completed          | 40%             | Strong hook, low friction form                |
| Audit completed → Email captured      | 30%             | Value-first design (show results before gate) |
| Email captured → Consultation booked  | 8%              | High-intent leads, personalized follow-up     |
| Consultation booked → Credit purchase | 50%             | Credex core sales motion                      |

### Funnel Math (per 1,000 visitors)

| Stage                 | Count                     |
| --------------------- | ------------------------- |
| Visitors              | 1,000                     |
| Audits completed      | 400                       |
| Emails captured       | 120                       |
| Consultations booked  | 10                        |
| Credit purchases      | 5                         |
| **Revenue generated** | **5 × $400 LTV = $2,000** |

**Revenue per 1,000 visitors = $2,000**  
**Revenue per visitor = $2.00**

---

## What Traffic Volume Drives $1M ARR?

### Target: $1,000,000 ARR

```
$1,000,000 ARR ÷ $400 LTV = 2,500 customers needed

2,500 customers ÷ 50% close rate = 5,000 consultations

5,000 consultations ÷ 8% booking rate = 62,500 email leads

62,500 leads ÷ 30% email capture rate = 208,333 audits completed

208,333 audits ÷ 40% completion rate = 520,833 site visits
```

### Summary Table

| To achieve | You need                  |
| ---------- | ------------------------- |
| $1M ARR    | ~520K site visits/year    |
| $1M ARR    | ~208K audits/year         |
| $1M ARR    | ~62K emails captured/year |
| $1M ARR    | **1,700 site visits/day** |

At 1,700 visits/day, this is achievable with:

- Organic SEO on "AI tool cost calculator" keywords
- Viral sharing (each user shares their audit link)
- Credex email list activation

---

## Sensitivity Analysis

| Scenario     | Close Rate | LTV  | Visits for $1M ARR |
| ------------ | ---------- | ---- | ------------------ |
| Conservative | 50%        | $400 | 520,000            |
| Base Case    | 55%        | $600 | 280,000            |
| Optimistic   | 60%        | $800 | 150,000            |

**Even in the conservative case, the tool pays for itself at ~1,700 visits/day.**

---

## Cost to Run the Tool

| Item                   | Monthly Cost             |
| ---------------------- | ------------------------ |
| Vercel hosting         | $0 (free tier)           |
| Supabase database      | $0 (free tier, 500MB)    |
| Resend emails          | $0 (free tier, 3,000/mo) |
| Claude API (summaries) | ~$5 (at 1,000 audits/mo) |
| **Total**              | **~$5/month**            |

**ROI: A single converted customer ($400 LTV) covers 80 months of infrastructure cost.**
