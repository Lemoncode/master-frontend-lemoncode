---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, producing a PRD as output. Use when user wants to stress-test a plan, get grilled on their design, create a PRD, define product requirements, or mentions "grill me", "PRD", or "requirements". First step in the chain grill-me → prd-to-plan → prd-to-issues.
---

# Grill Me

## Core Principle

Push the user to think deeper by asking hard questions and presenting alternatives they haven't considered. The goal is not just validation — it's making the user progress by discovering better options.

## Mode Detection

Detect automatically based on what the user provides:

- **Validation** — user brings a structured plan with decisions already taken → challenge and verify
- **Co-creation** — user brings a vague idea or wish → build the design together through questions

If ambiguous, ask: "¿Quieres que desafíe tu plan o que lo construyamos juntos?"

## Workflow

### 1. Setup

- Announce: "Por defecto voy a explorar tu codebase para hacer preguntas más relevantes. Si prefieres que no lo haga, dímelo."
- If allowed, do a quick reconnaissance: project structure, stack, existing patterns
- Detect mode (validation vs co-creation)

### 2. Big Picture (Phase A)

High-level questions first — validate the direction before diving into details:

- Does the overall approach make sense?
- Are there fundamental assumptions to challenge?
- Cover both **technical** and **product/UX** perspectives

### 3. Branch by Branch (Phase B)

Identify key decisions, then resolve each branch:

- Ask → discuss → resolve → close the branch
- When a branch spawns sub-branches, note them and ask if worth exploring
- **Checkpoints**: after closing important branches, offer new points: "Veo X puntos más que podríamos explorar: [list]. ¿Merece la pena?"

### 4. Co-creation Approach

When the user doesn't have a formed opinion: **Socratic + proposals**.

- Present concrete alternatives with trade-offs, not just open questions
- "Tienes estas opciones: A (pros/cons), B (pros/cons). ¿Cuál encaja más?"
- This helps the user learn and progress, not just decide

### 5. Closing

When branches are exhausted or user says "suficiente":

- Generate PRD at `./plans/prd-<topic>-<date>.md`
- See [reference.md](reference.md) for PRD template

## Tone

**Adaptive** — start curious-collaborative. If the user gives shallow answers ("porque sí", "no sé"), increase intensity to push deeper thinking. Always constructive, never hostile.

## Codebase Exploration

- **At start**: quick project reconnaissance (structure, stack, patterns)
- **During**: on-demand when a question can be answered by code
- **User opt-out**: respected if requested at setup

## Pause & Resume

When the user wants to pause:

1. Save current state to `./plans/prd-<topic>-<date>.md` with status "en progreso"
2. Include decided branches, open branches, and pending points
3. To resume: user says "sigue con el grill de X" → read the file and continue

## Scope

Covers **both technical and product/UX**. Don't assume product decisions are resolved unless the user explicitly says so. Many technical users benefit from being pushed on UX and business aspects.

## Uncontemplated Scenarios

When a question or topic doesn't clearly fit these rules:

1. Apply the closest matching approach with reasoning
2. **Flag it**: "This scenario isn't covered by the grill-me skill. I applied [approach] because [reason]. Want to update the skill?"
3. Offer to add a new rule for the case

See [reference.md](reference.md) for the PRD template, question categories, and tone calibration.
