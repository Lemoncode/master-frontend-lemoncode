# Grill Me — Reference

## PRD Output Template

Save to `./plans/prd-<topic>-<date>.md`:

```markdown
# PRD: <topic>

**Date**: YYYY-MM-DD
**Mode**: validation | co-creation
**Status**: in progress | completed

## Problem Statement

<!-- What problem does this solve? From the user's perspective -->
<!-- What was discovered from codebase exploration -->

## User Stories

<!-- Extensive list covering all aspects of the feature -->

1. As a <actor>, I want <feature>, so that <benefit>

## Product / UX Decisions

<!-- User-facing decisions with reasoning -->

- **<Decision area>**: <choice> — because <reasoning>

## Technical Decisions

<!-- Technical decisions with reasoning -->

- **<Decision area>**: <choice> — because <reasoning>

## Testing Decisions

<!-- What to test and how, per domain area -->

- **<Area>**: <what to test and approach>

## Out of Scope

<!-- Explicitly excluded to prevent scope creep -->

- <Thing that will NOT be addressed>

## Discarded Alternatives

<!-- Options considered and rejected, with reasons -->

- **<Alternative>**: discarded because <reason>

## Assumptions

<!-- Things assumed true but not validated -->

- <Assumption that could change and invalidate decisions>

## Risks

<!-- Concerns flagged during the grill, not decisions -->

- <Risk and its potential impact>

## Open Points

<!-- Branches not explored or unresolved -->

- [ ] <Open point to explore in the future>

## Next Steps

<!-- Typical next step: prd-to-plan → prd-to-issues -->

- [ ] Run `prd-to-plan` to create implementation phases
- [ ] <Other actions if needed>
```

### Status Values

- **in progress** — grill paused, can be resumed
- **completed** — all branches resolved or user said enough

### When Pausing

When saving an in-progress grill, add a section between "Problem Statement" and "User Stories":

```markdown
## Grill State

### Closed Branches

- <Branch>: resolved as <decision>

### Current Branch

- <Branch being discussed>: <where we left off>

### Pending Branches

- <Branch detected but not yet explored>
```

Remove this section when the grill completes — its content will be distributed into the final sections.

---

## Question Categories

### Product/UX Questions

Use these to push the user beyond technical thinking:

- **User**: Who uses it? What problem do they have? How do they solve it today?
- **Flow**: What's the happy path? What if the user makes a mistake? How do they go back?
- **User edge cases**: What if they abandon mid-flow? Poor connection? Mobile?
- **Value**: Why would the user choose this over the alternative? What's the "aha moment"?
- **Prioritization**: If you could only ship one thing, what would it be? What can you postpone?
- **User stories**: For each product decision, generate user stories with format "As a X, I want Y, so that Z"

### Technical Questions

- **Functional gaps**: What happens if X occurs and it's not handled?
- **Trade-offs**: You chose A, why not B? What's the expected volume/load?
- **Technical edge cases**: What happens when the connection drops? Corrupted data? Concurrency?
- **Scalability**: This works with 10 users, what about 10,000?
- **Alternatives**: Have you considered doing Z instead of Y? What would you gain/lose?
- **Security**: What if a malicious user does X? How do you protect against it?
- **Operations**: How do you deploy it? Monitor it? Rollback?
- **Testing**: What deserves a test? What approach (unit, integration, e2e)? What NOT to test?

### Meta Questions (for both modes)

- **Assumptions**: What are you assuming to be true? What if it's not?
- **Dependencies**: What needs to exist before this works? Who else is affected?
- **Simplification**: Is there a simpler version that delivers 80% of the value?
- **Scope**: What's explicitly out? Is there something that looks "in scope" but shouldn't be?

---

## Tone Calibration

### Level 1 — Curious-collaborative (default start)

> "Interesting that you chose JWT. What led you to that decision?"

Use when: user is engaged, gives thoughtful answers, is thinking actively.

### Level 2 — Challenging

> "You say JWT, but your app is monolithic and doesn't need inter-service communication. Do you really need stateless tokens or does it add more complexity than value?"

Use when: user gives surface-level answers, doesn't consider alternatives, or repeats conventional wisdom without reasoning.

### Level 3 — Provocative-constructive

> "Why JWT? Give me a real reason, not 'because everyone uses it'. Server-side sessions with Redis solve your case with half the complexity."

Use when: user consistently avoids deep thinking, gives shallow answers, or needs a strong push.

**Never go beyond level 3.** Always constructive, never hostile or dismissive.

### Escalation signals

- "I don't know" → present options with trade-offs (don't just push)
- "Because it's standard" → challenge with concrete alternative
- Thoughtful but incomplete → ask follow-up on the gap
- Deep, well-reasoned answer → acknowledge and move to next branch

---

## Cross-References with Other Skills

The grill output (PRD) feeds into the skill chain:

```
grill-me → PRD → prd-to-plan → Plan (phases) → prd-to-issues → GitHub Issues
```

| Scenario                                    | Next skill      |
| ------------------------------------------- | --------------- |
| PRD completed → needs implementation phases | `prd-to-plan`   |
| PRD phases created → needs GitHub issues    | `prd-to-issues` |
| Grill identified a bug during exploration   | `triage-issue`  |

Mention these options in the "Next Steps" section of the output.
