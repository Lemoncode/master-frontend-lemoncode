# Visual Composition Review

After building or editing any section in Figma, run this review before moving on. The goal is to catch issues early, when they're cheap to fix, rather than at the end.

---

## When to review

- After every `use_figma` call that creates or modifies nodes
- Before declaring a section "done"
- After the full screen is assembled (final review)

---

## Step 1: Screenshot the section

Always screenshot at the **section level**, not the full page. Full-page screenshots at reduced resolution hide:
- Text clipping (descenders cut off, lines missing)
- Overlapping elements
- Placeholder text ("Title", "Heading", "Button")
- Wrong component variants

```js
// Call get_screenshot with the section's node ID
// get_screenshot({ nodeId: "SECTION_NODE_ID" })
```

---

## Step 2: Visual checklist

Check every item. Fix before moving on.

### Layout
- [ ] All frames have `layoutMode !== "NONE"` — no fixed-position structure
- [ ] No children are absolutely positioned inside structural frames (only OK for overlays)
- [ ] Content is not clipped by a parent frame (check `clipsContent`)
- [ ] No unexpected gaps or missing spacing between sections
- [ ] FILL children are correctly filling their parent (not overflowing or collapsed)

### Variables
- [ ] All fills are bound to color variables (no hardcoded hex/rgb)
- [ ] All padding and gap values are bound to spacing variables
- [ ] All corner radii are bound to radius variables
- [ ] Strokes/borders are bound to border color variables

### Components
- [ ] All UI elements are component instances from the library (no raw shapes where a component exists)
- [ ] No placeholder text: "Title", "Heading", "Button", "Label", "Description", "Name"
- [ ] Component variants match intent (e.g., Primary not Neutral, Large not Small)
- [ ] Nested component text overrides applied correctly

### Typography
- [ ] All text nodes have `textStyleId` set (from imported library style)
- [ ] No manual `fontSize`, `fontWeight`, `fontFamily` overrides (unless intentional)

### Effects
- [ ] Shadows and blurs use `effectStyleId` (not inline `effects` array)

---

## Step 3: Compare against reference library example

This confirms the new design is visually consistent with what already exists in the file.

### Find a reference frame

```js
// List all top-level frames on the current page
const frames = figma.currentPage.children
  .filter(n => n.type === "FRAME")
  .map(n => ({ name: n.name, id: n.id, w: n.width, h: n.height }));
return frames;
```

Pick an existing screen that uses similar components.

### Compare component keys

```js
// Extract component keys used in reference frame
const refFrame = figma.currentPage.findOne(n => n.name === "Reference Screen");
const keys = new Set();
refFrame.findAll(n => n.type === "INSTANCE").forEach(inst => {
  const mc = inst.mainComponent;
  const parent = mc?.parent;
  keys.add(parent?.type === "COMPONENT_SET" ? parent.key : mc?.key);
});
return [...keys];
```

```js
// Extract component keys used in the new frame
const newFrame = await figma.getNodeByIdAsync("NEW_FRAME_ID");
const newKeys = new Set();
newFrame.findAll(n => n.type === "INSTANCE").forEach(inst => {
  const mc = inst.mainComponent;
  const parent = mc?.parent;
  newKeys.add(parent?.type === "COMPONENT_SET" ? parent.key : mc?.key);
});
return [...newKeys];
```

Any key present in the reference but missing in the new frame means you may have used the wrong component or drawn it manually.

### Side-by-side screenshot comparison

Take a screenshot of both frames:
1. `get_screenshot({ nodeId: "REFERENCE_FRAME_ID" })`
2. `get_screenshot({ nodeId: "NEW_FRAME_ID" })`

Compare visually:
- Do spacing / padding rhythms match?
- Do corner radii match?
- Do text sizes / weights match?
- Do colors (backgrounds, text, borders) use the same tokens?

---

## Step 4: Fix issues (targeted, not rebuild)

For every issue found:

1. Identify the specific node ID(s) involved.
2. Write a **targeted fix script** — modify only what's broken.
3. Do NOT recreate the entire section.
4. Screenshot again after the fix to confirm resolution.

```js
// Example: Fix a hardcoded padding
const frame = await figma.getNodeByIdAsync("FRAME_ID");
const spaceVar = await figma.variables.importVariableByKeyAsync("SPACE_400_KEY");
frame.setBoundVariable("paddingTop", spaceVar);
frame.setBoundVariable("paddingBottom", spaceVar);
return { mutatedNodeIds: [frame.id] };
```

---

## Common Issues and Fixes

| Issue | Root cause | Fix |
|-------|-----------|-----|
| Text is clipped | Frame height is FIXED but content grew | Set `primaryAxisSizingMode = "HUG"` |
| Elements overlap | Children using absolute positioning | Remove `isAbsolutePositionEnabled`, use auto layout |
| Placeholder text visible | `setProperties` not called | Run `instance.setProperties({ "Label#X:Y": "actual text" })` |
| Wrong variant (e.g., neutral button) | Default variant chosen without checking source | Find correct variant: `btnSet.children.find(c => c.name.includes("variant=primary"))` |
| Gap not respecting token | Gap set as number before variable bind | Clear the number, then bind the variable |
| Component drawn as rectangle | No library search done | Search `search_design_system`, import and instance instead |
