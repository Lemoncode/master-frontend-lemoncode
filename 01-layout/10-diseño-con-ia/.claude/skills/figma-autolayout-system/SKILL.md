---
name: figma-autolayout-system
description: >
  **ALWAYS use this skill** whenever designing or editing frames in Figma. This skill enforces best practices for Auto Layout on every frame, binding variables and components from published libraries, and performing a visual composition review with library examples. Triggers: 'design a screen', 'create a layout', 'add a section', 'build a component', 'use auto layout', 'apply variables', 'use library components', 'design with tokens', 'maintain visual consistency', or any design task in Figma where frames, spacing, or components are involved. Never hardcode spacing, colors, or radii — always resolve and bind from the design system. Use alongside figma-use (mandatory) and figma-generate-design (for full screens).
---

# Figma Auto Layout · Variables · Library Components · Visual Review

This skill defines the **non-negotiable design standards** for every frame created or edited in Figma:

1. **Auto Layout on every frame you create** — no fixed-position layouts
2. **Variables from library** — no hardcoded spacing, color, or radius values
3. **Components from library** — no manually-drawn primitives when a component exists
4. **Visual composition review** — screenshot + diff against library examples before finishing

**MANDATORY**: Always also load [figma-use](../figma-use/SKILL.md) before any `use_figma` call. Its critical rules (color ranges 0–1, font loading, page context, etc.) apply to every script here.

**Pass `skillNames: "figma-autolayout-system"` in every `use_figma` call** (logging only, does not affect execution).

---

## 1. Auto Layout — Always On (for frames YOU create)

### ⚠️ FrameNode vs. InstanceNode — know the difference first

This is the most important distinction in this skill. Before touching any node's `layoutMode`, identify its type:

| Node type | How it exists | Set `layoutMode`? | Set padding/gap? |
|-----------|--------------|-------------------|-----------------|
| `FrameNode` | `figma.createFrame()` — you built it | ✅ Always | ✅ Bind to variables |
| `ComponentNode` | `figma.createComponent()` — you built it | ✅ Yes | ✅ Bind to variables |
| `InstanceNode` | `component.createInstance()` — from the library | ❌ **Never** | ❌ Don't touch internals |
| `ComponentSetNode` | The library's component set container | ❌ **Never** | ❌ Don't touch internals |

**When you place a library component instance, its internal layout is owned by its master component. Never set `layoutMode`, `paddingTop`, `paddingLeft`, `itemSpacing`, or any other layout property directly on an `InstanceNode`.** Doing so will visually corrupt or detach the component.

What you *can* do on an instance is control how it sits inside your auto-layout frame:
```js
parent.appendChild(instance);                      // add to your container
instance.layoutSizingHorizontal = "FILL";          // how it sizes inside parent
instance.setProperties({ "Label#2:0": "Click" });  // override component props
```

That's it. Never go further into the instance's internals.

You can guard against accidental layout changes with a type check:
```js
// Guard: only apply auto-layout to frames/components you own
if (node.type === "FRAME" || node.type === "COMPONENT") {
  node.layoutMode = "VERTICAL";
  // ... bind variables etc.
}
// node.type === "INSTANCE" → only set sizing or properties, nothing else
```

---

Every `FrameNode` or `ComponentNode` **you create** must have Auto Layout enabled. No exceptions for frames you own.

### Minimal auto-layout frame

```js
const frame = figma.createFrame();
frame.name = "Section";
frame.layoutMode = "VERTICAL";           // or "HORIZONTAL"
frame.primaryAxisSizingMode = "HUG";     // shrink-wraps children on primary axis
frame.counterAxisSizingMode = "FIXED";   // set explicit width
frame.resize(frame.width, frame.height); // resize BEFORE setting FILL/HUG
frame.paddingTop    = 24;
frame.paddingBottom = 24;
frame.paddingLeft   = 24;
frame.paddingRight  = 24;
frame.itemSpacing   = 16;
frame.counterAxisAlignItems = "MIN";     // LEFT / CENTER / MAX
frame.primaryAxisAlignItems  = "MIN";    // TOP  / CENTER / MAX / SPACE_BETWEEN
```

### Sizing mode cheat-sheet

| Mode | `primaryAxisSizingMode` | `counterAxisSizingMode` | Notes |
|------|------------------------|------------------------|-------|
| HUG content | `HUG` | `HUG` | Frame wraps around its children |
| Fixed width, hug height | `HUG` | `FIXED` | Common for cards |
| Full-width fill | `HUG` | `FIXED` (or set via parent) | Parent must be auto-layout |
| Explicit both | `FIXED` | `FIXED` | Use sparingly — prefer HUG |

### FILL children

`layoutSizingHorizontal/Vertical = 'FILL'` **must be set AFTER `parent.appendChild(child)`**.
This applies to both child frames AND child instances:

```js
parent.appendChild(child);
child.layoutSizingHorizontal = "FILL"; // ONLY after appending
```

### Nesting rules

- Every child **frame** (not instance) of an auto-layout parent should itself be an auto-layout frame.
- Instances from the library slot into your auto-layout frames as children — their internal layout is not yours to change.
- Do not use absolute positioning (`isAbsolutePositionEnabled`) except for overlays and decorative elements that intentionally float above the layout.
- Group nodes only for export — use nested auto-layout frames for structure.

---

## 2. Bind Variables — Never Hardcode

### Discovery first

Before writing any value, resolve it from the library. See [variable-resolution.md](references/variable-resolution.md) for a full resolution order and fallback chain.

```js
// Step 1: search for spacing variables
// (use search_design_system, not getLocalVariableCollectionsAsync)
// search_design_system({ query: "space", includeVariables: true })
// search_design_system({ query: "gap" })
// search_design_system({ query: "padding" })
```

### Bind spacing / padding / gap

Only bind variables on frames/components you created — never on instances:

```js
const spaceVar = await figma.variables.importVariableByKeyAsync("SPACE_VAR_KEY");

// padding — only on FrameNode or ComponentNode you own
frame.setBoundVariable("paddingTop",    spaceVar);
frame.setBoundVariable("paddingBottom", spaceVar);
frame.setBoundVariable("paddingLeft",   spaceVar);
frame.setBoundVariable("paddingRight",  spaceVar);
frame.setBoundVariable("itemSpacing",   spaceVar);
```

### Bind colors (fills / strokes)

`setBoundVariableForPaint` returns a **new** paint — always capture and reassign:

```js
const colorVar = await figma.variables.importVariableByKeyAsync("BG_COLOR_VAR_KEY");
const currentFills = [...frame.fills];
const newFill = figma.variables.setBoundVariableForPaint(currentFills[0], "color", colorVar);
frame.fills = [newFill];
```

### Bind border radius

```js
const radiusVar = await figma.variables.importVariableByKeyAsync("RADIUS_VAR_KEY");
frame.setBoundVariable("topLeftRadius",     radiusVar);
frame.setBoundVariable("topRightRadius",    radiusVar);
frame.setBoundVariable("bottomLeftRadius",  radiusVar);
frame.setBoundVariable("bottomRightRadius", radiusVar);
```

### Variable scope reference

Use specific scopes — never default `ALL_SCOPES`:

| Variable type | Recommended scope(s) |
|--------------|----------------------|
| Background fill | `["FRAME_FILL", "SHAPE_FILL"]` |
| Text color | `["TEXT_FILL"]` |
| Border/stroke | `["STROKE_COLOR"]` |
| Gap / spacing | `["GAP"]` |
| Padding | `["WIDTH_HEIGHT"]` |
| Corner radius | `["CORNER_RADIUS"]` |

---

## 3. Library Components — Always Import, Never Draw

### Resolution order

1. **Inspect existing screens** — walk instances in a reference frame to get authoritative keys.
2. **search_design_system** — broad search with synonyms ("button", "btn", "cta", "action").
3. **Only build manually** if nothing exists in the library for this element.

### Import and instantiate

```js
// Component set (multiple variants)
const btnSet = await figma.importComponentSetByKeyAsync("BUTTON_SET_KEY");
const primaryBtn = btnSet.children.find(c =>
  c.name.toLowerCase().includes("variant=primary")
) || btnSet.defaultVariant;
const instance = primaryBtn.createInstance();
parent.appendChild(instance);
instance.layoutSizingHorizontal = "FILL"; // after append — this is fine
// ✋ Stop here. Do NOT set layoutMode, padding, itemSpacing etc. on `instance`.
```

### What you can and cannot do with instances

```js
// ✅ OK — sizing within the parent container
instance.layoutSizingHorizontal = "FILL";
instance.layoutSizingVertical   = "HUG";

// ✅ OK — override component properties (text, icon, state, variant)
instance.setProperties({ "Label#2:0": "Get Started" });

// ✅ OK — swap a nested instance to a different component
const nested = instance.findOne(n => n.type === "INSTANCE" && n.name === "Icon");
if (nested) nested.setProperties({ "icon#12:0": "arrow-right" });

// ❌ WRONG — never set layout properties on an instance
instance.layoutMode    = "HORIZONTAL"; // ← breaks/detaches the component
instance.paddingTop    = 16;           // ← corrupts component internals
instance.itemSpacing   = 8;           // ← corrupts component internals
instance.primaryAxisSizingMode = "HUG"; // ← wrong — this is the master's job
```

The reason: instances are live links to their master component. Changing structural layout properties on an instance either silently corrupts the output or causes Figma to detach it, losing all the design system benefits.

### Apply text + effect styles

```js
const textStyle   = await figma.importStyleByKeyAsync("TEXT_STYLE_KEY");
const shadowStyle = await figma.importStyleByKeyAsync("SHADOW_STYLE_KEY");

textNode.textStyleId   = textStyle.id;
frame.effectStyleId    = shadowStyle.id;
```

---

## 4. Visual Composition Review

After every section or significant change, **take a screenshot and compare against the library**. This is not optional.

### Review checklist (run after each section)

```
[ ] All frames YOU CREATED have layoutMode !== "NONE" (instances are excluded from this check)
[ ] No hardcoded hex colors on frames you own — all fills bound to variables
[ ] No hardcoded spacing numbers on frames you own — all padding/gap bound to variables
[ ] No hardcoded radius on frames you own — all corners bound to variables
[ ] All UI elements are component instances (not raw shapes)
[ ] No layout properties (layoutMode, padding, itemSpacing) set on InstanceNodes
[ ] Text uses textStyleId (not manual font size / weight)
[ ] Effects (shadows, blurs) use effectStyleId
[ ] FILL children set after appendChild
[ ] No absolute-positioned nodes in structural frames
[ ] Screenshot passes visual diff (no clipping, no overlap, no placeholder text)
```

### Screenshot per section

```js
// After building a section, get its screenshot for review
const sectionNode = await figma.getNodeByIdAsync("SECTION_NODE_ID");
// Then call get_screenshot({ nodeId: sectionNode.id })
```

Always screenshot at section level — full-page screenshots hide clipping and overflow.

### Compare against library examples

Before finalising, visually compare the new section against an existing reference screen:

1. Use `get_metadata` on a reference frame to list its component instances and their keys.
2. Confirm your new section uses the same component keys (not different variants).
3. Use `get_screenshot` on both the reference and the new section side-by-side.
4. Fix any discrepancies: wrong variant, wrong spacing token, wrong text style.

For the full discovery and comparison workflow see [visual-review.md](references/visual-review.md).

---

## 5. Full Workflow Summary

```
1. Inspect the file
   └─ List pages, existing screens, variable collections, component sets

2. Discover library assets
   ├─ search_design_system → spacing, color, radius variables
   ├─ search_design_system → components (button, card, input, nav…)
   └─ Walk existing screen instances for authoritative keys

3. Build each section (one use_figma call per section)
   ├─ Create FrameNode with layoutMode = VERTICAL | HORIZONTAL
   ├─ Bind all padding / gap → spacing variables
   ├─ Bind all fills → color variables
   ├─ Bind all radii → radius variables
   ├─ Import library components → createInstance() → appendChild()
   │    └─ Only set layoutSizingHorizontal/Vertical on instances, nothing else
   ├─ Apply text styles and effect styles
   └─ Return { createdNodeIds, mutatedNodeIds }

4. After each section
   └─ get_screenshot → check for clipping, overlap, placeholder text

5. After all sections
   ├─ get_screenshot on full page
   ├─ Compare against reference screen (component keys + visual diff)
   └─ Fix any issues (targeted fix, not full rebuild)
```

---

## 6. Reference Docs

Load these as needed:

| Doc | When to load |
|-----|-------------|
| [variable-resolution.md](references/variable-resolution.md) | Finding correct variable keys (spacing, color, radius) |
| [visual-review.md](references/visual-review.md) | Screenshot comparison workflow and diff checklist |
| [autolayout-patterns.md](references/autolayout-patterns.md) | Complex layout examples: responsive grids, nested stacks, overflow scroll |
| [figma-use SKILL.md](../figma-use/SKILL.md) | **Always load** — critical API rules |
| [figma-generate-design SKILL.md](../figma-generate-design/SKILL.md) | Full screen assembly workflow |

---

## 7. Quick Violation Reference

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `frame.paddingTop = 24` (hardcoded on your frame) | `frame.setBoundVariable("paddingTop", spaceVar)` |
| `frame.fills = [{type:"SOLID", color:{r:0,g:0,b:0}}]` | bind to color variable via `setBoundVariableForPaint` |
| `frame.cornerRadius = 8` (hardcoded) | `frame.setBoundVariable("topLeftRadius", radiusVar)` |
| Creating a `RectangleNode` for a button background | Import button component set, create instance |
| `frame.layoutMode = "NONE"` on a frame you created | Always set `layoutMode = "VERTICAL"` or `"HORIZONTAL"` |
| `instance.layoutMode = "HORIZONTAL"` on a library instance | ❌ Never — instances own their layout internally |
| `instance.paddingTop = 16` on a library instance | ❌ Never — use `setProperties()` for overrides |
| Setting `FILL` before `appendChild` | `parent.appendChild(child)` **then** `child.layoutSizingHorizontal = "FILL"` |
| Skipping `get_screenshot` after a section | Always screenshot; check clipping, overlaps, placeholders |
