# USER_INTERVIEWS.md — Founder & Developer Conversations

> Interviews conducted by Harita Paliwal on 12 May 2026.
> Three real conversations with software engineers at Indian product companies actively paying for AI developer tools.

---

## Interview 1 — Shantanu Singh Rathore, SDE 1 at Cleartrip (Flipkart)

**Date:** 12 May 2026  
**Duration:** ~10–15 min  
**How recruited:** Personal network  
**Role:** Software Development Engineer I  
**Company stage:** Scale-up (Cleartrip is a Flipkart subsidiary — publicly traded parent)

### Their Stack

- Tools they pay for: **Cursor**
- Team size: **4 developers**
- Spend: **~$200/person/month**
- Total monthly AI spend: **~$800/month**

### What Our Audit Would Find

Cursor Pro is $20/seat/month. For 4 seats that's $80/month.  
At $800/month, the team is potentially paying **10× the standard rate** — suggesting either enterprise overhead, API overage charges, or billing confusion.  
**Estimated savings: ~$720/month** if moved to standard Cursor Pro plan.

### Direct Quotes

> "As a SDE 1 I don't have visibility into the pricing"

> "My team lead once told me that we are spending a lot on AI but I don't have visibility into the pricing"

> "what make me trust audit tool is when i see the actual price and compare with the tool's calculation."

### What This Changed About Your Design

A team of 4 at a large company (Flipkart subsidiary) is paying $200/person — far above standard pricing. This suggests that **enterprise employees don't know their own per-seat cost** — it's buried in department billing. The tool should flag when per-seat spend exceeds published pricing, not just when absolute numbers look high.

---

## Interview 2 — Krishna Saraswat, SDE 1 at Flipkart

**Date:** 12 May 2026  
**Duration:** ~10–15 min  
**How recruited:** Personal network  
**Role:** Software Development Engineer I  
**Company stage:** Late-stage / public (Flipkart, Walmart subsidiary)

### Their Stack

- Tools they pay for: **Cursor**
- Team size: **17 developers**
- Spend: **~$200/person/month**
- Total monthly AI spend: **~$3,400/month**

### What Our Audit Would Find

At 17 seats, Cursor Business ($40/seat) would cost $680/month.  
At $200/person, the team is spending $3,400/month — **5× the Business plan rate**.  
**Estimated savings: ~$2,720/month** — one of the highest-savings scenarios the tool would surface.

### Direct Quotes

> "I think per person needs this much of credits."

> "My manager circulate the excel sheet for taking the credits whether they need or not."

> "I think audit tool may help the team leads to decide whether to spend this much on the ai tool or not."

### What This Changed About Your Design

At 17 people, no single SDE 1 controls the budget — it goes through procurement. This revealed a gap: the tool currently speaks to the **individual paying their own subscription**, but the real pain point for mid-large teams is **convincing someone else (a manager or finance team) to act**. The shareable audit URL is therefore more important than the results page itself — it's the artifact you send upward.

---

## Interview 3 — Shivansh Goyal, SDE 1 at Meesho

**Date:** 12 May 2026  
**Duration:** ~10–15 min  
**How recruited:** Personal network  
**Role:** Software Development Engineer I  
**Company stage:** Scale-up (Meesho is a unicorn, Series F)

### Their Stack

- Tools they pay for: **Claude Code** (Anthropic)
- Team size: **30 developers**
- Spend: **~$300/person/month**
- Total monthly AI spend: **~$9,000/month**

### What Our Audit Would Find

Claude Code ($100/month per user via Claude Pro + API usage) for 30 devs would be ~$3,000/month on the standard plan.  
At $300/person, the team may be on heavy API usage billing — $9,000/month vs. a managed plan baseline.  
**Estimated savings: $2,000–$6,000/month** depending on actual usage patterns.

### Direct Quotes

> "This much spend is mandatory because in the work claude usage is very much and so we need to have high token usage."

> "My team also supports this much of usage."

> "Asking about audit tool, then why not it can help, but I think one who is taking care of the credits given to us will be using some calculation to decide how much to spend."

### Most Surprising Thing He Said

> He said that right now his company is planning to use AI everywhere and to automate the things, so company should not be spending much on the cost of AI or he was trying to say that company nows its own profit and loss.

### What This Changed About Your Design

A 30-person team spending $9K/month on Claude Code is the clearest signal yet that **large teams have the most to gain but the least visibility**. At this scale, even a 20% reduction is $1,800/month. The tool should make the dollar figure as large and prominent as possible in the results — the headline savings number is the hook for forwarding the report to a manager.

---

## Cross-Interview Patterns

After 3 conversations, three themes emerged:

### 1. Nobody knows their per-seat cost

All three interviewees knew the tool name but couldn't immediately state the per-seat price. Spend awareness was total-team-level at best, and even that was fuzzy.

### 2. The person in the conversation is never the decision-maker

All three are SDE 1s — they use the tool, but the billing goes through team leads or central IT/finance. **The real design implication: the shareable link is more valuable than the results screen.** The goal is to generate a report artifact that travels up the org chart.

### 3. Large teams are dramatically overpaying

Combined, these 3 teams spend ~$13,200/month. Our audit estimates they could save $5,000–$9,000/month by consolidating to standard plans — a 40–70% reduction.

---
