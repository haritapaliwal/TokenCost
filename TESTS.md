# TESTS.md

## Test Coverage

`npm test` runs the full suite via **Jest** + **ts-jest**.

### How to Run

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage report
```

---

## Test Files

### `__tests__/auditEngine.test.ts`

**Covers:** The core deterministic audit engine (`lib/auditEngine.ts`)

| ID  | Description                                                            | Assertion                                                |
| --- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| T01 | Solo user on Cursor Business → downgrade to Pro                        | `savings = $20`, `status = savings_found`                |
| T02 | Solo ChatGPT Business user (coding) → switch to GitHub Copilot Pro     | `savings = $15`, action contains 'GitHub Copilot Pro'    |
| T03 | Solo user on Cursor Pro → already optimal                              | `status = already_optimal`, `totalMonthlySavings = 0`    |
| T04 | High-volume OpenAI API usage >$500/mo → model migration to GPT-4o mini | `savings = $350`, action contains 'GPT-4o mini'          |
| T05 | 2-seat team on Cursor Business → downgrade both to Pro                 | `savings = $40`, `status = savings_found`                |
| T06 | 50-seat team on Cursor Teams → correctly marked optimal                | `status = already_optimal`, `savings = 0`                |
| T07 | Multiple tools (Cursor + OpenAI API) → savings aggregate correctly     | `totalMonthlySavings = 370`, `totalAnnualSavings = 4440` |

---

### `__tests__/fallbackSummary.test.ts`

**Covers:** The AI fallback narrative generator (`lib/fallbackSummary.ts`)

| ID  | Description                                                      | Assertion                                                      |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| F01 | Savings found → narrative mentions tool name, action, and amount | Contains 'spending more than necessary', 'Cursor', '$20/month' |
| F02 | No savings → optimal narrative generated                         | Contains 'well-matched', 'no obvious overspend'                |

---

## Summary

- **Total Tests:** 9
- **Test Suites:** 2
- **Pass Rate:** 100%
- **CI:** Runs automatically on every push via GitHub Actions (`.github/workflows/ci.yml`)
