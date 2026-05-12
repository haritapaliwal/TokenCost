# METRICS.md — Success Metrics Framework

## North Star Metric

> **Audits completed that result in email capture**

This is the only metric that matters for Day 1–90. It represents:

- A user who found enough value to share their contact info (signal of real intent)
- A qualified lead for Credex credit upsell
- A potential referral source (they have a shareable link)

**Not** DAU. **Not** page views. This is a B2B lead-gen tool — traffic without conversion is noise.

---

## Tracking Formula

```
Quality Audits = Audits Completed × Email Capture Rate

Target Week 1:  Quality Audits ≥ 5
Target Month 1: Quality Audits ≥ 60
Target Month 3: Quality Audits ≥ 300
```

---

## 3 Input Metrics

These are the levers that drive the North Star:

### 1. Audit Completion Rate

**Definition:** % of visitors who reach the results page  
**Target:** ≥ 40%  
**How to improve:** Reduce form friction, improve tool selection UX, add progress indicator  
**Warning sign:** < 20% (form is too long or confusing)

### 2. Email Capture Rate (of completed audits)

**Definition:** % of audit completions that result in an email submission  
**Target:** ≥ 30%  
**How to improve:** Improve the "Save Report" CTA copy, add urgency or benefit framing  
**Warning sign:** < 15% (value proposition isn't landing, or timing of prompt is wrong)

### 3. Shareable Link Click-Through Rate

**Definition:** % of audits that generate a clicked shareable link  
**Target:** ≥ 20%  
**How to improve:** Make sharing feel natural (show the link prominently after audit)  
**Warning sign:** < 5% (users aren't seeing or understanding the share feature)

---

## Pivot Triggers

The following signal that the current approach isn't working and warrants a strategy change:

| Signal                                              | Threshold | Suggested Pivot                                                        |
| --------------------------------------------------- | --------- | ---------------------------------------------------------------------- |
| Email capture rate stays below 10% after 500 audits | < 10%     | Move email gate earlier (before results); test different CTA copy      |
| Audit completion rate < 15%                         | < 15%     | Simplify form to 3 fields; add a "quick estimate" mode                 |
| Zero repeat visitors after 30 days                  | 0         | Add email digest feature — "Your stack changed, re-audit"              |
| No shareable links ever clicked                     | 0 clicks  | Remove share feature, focus on direct email instead                    |
| Consultation booking rate < 2%                      | < 2%      | Replace consultation CTA with a self-serve Credex credit purchase flow |

---

## Weekly Dashboard (What to Check Every Monday)

```
Week N Report
─────────────────────────────
New site visits:          ___
Audits completed:         ___
Audit completion rate:    ___%
Emails captured:          ___
Email capture rate:       ___%
Shareable links created:  ___
Links clicked externally: ___
Consultations booked:     ___
─────────────────────────────
Quality Audits (NSM):     ___   ← Focus here
Week-over-week change:   +___%
```

---

## Why Not DAU or Page Views?

- **DAU** measures engagement. This tool is designed to be used once per quarter — low DAU is expected and fine.
- **Page views** measure traffic. Traffic without email capture creates zero business value.
- **Quality Audits** directly tie to revenue: each email captured has a calculable LTV of ~$400 (see ECONOMICS.md).
