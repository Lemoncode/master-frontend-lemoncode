# Auto Layout Patterns

Complex layout examples to copy and adapt. All use variable bindings — replace `VAR_KEY_*` with keys from your discovered library.

---

## Responsive horizontal row (space-between)

```js
const row = figma.createFrame();
row.name = "Row / Space Between";
row.layoutMode = "HORIZONTAL";
row.primaryAxisAlignItems  = "SPACE_BETWEEN";
row.counterAxisAlignItems  = "CENTER";
row.primaryAxisSizingMode  = "FIXED";
row.counterAxisSizingMode  = "HUG";
row.resize(1200, row.height); // explicit width

const paddingVar = await figma.variables.importVariableByKeyAsync("VAR_KEY_PADDING_LG");
row.setBoundVariable("paddingLeft",  paddingVar);
row.setBoundVariable("paddingRight", paddingVar);
row.setBoundVariable("paddingTop",   paddingVar);
row.setBoundVariable("paddingBottom",paddingVar);

return { createdNodeIds: [row.id] };
```

---

## Card grid (3-column, equal width)

```js
const grid = figma.createFrame();
grid.name = "Card Grid";
grid.layoutMode = "HORIZONTAL";
grid.layoutWrap = "WRAP";            // enables wrapping
grid.primaryAxisSizingMode = "FIXED";
grid.counterAxisSizingMode = "HUG";
grid.resize(1200, grid.height);
grid.primaryAxisAlignItems = "MIN";
grid.counterAxisAlignItems = "MIN";

const gapVar = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_24");
grid.setBoundVariable("itemSpacing",         gapVar);
grid.setBoundVariable("counterAxisSpacing",  gapVar);
grid.setBoundVariable("paddingTop",    gapVar);
grid.setBoundVariable("paddingBottom", gapVar);
grid.setBoundVariable("paddingLeft",   gapVar);
grid.setBoundVariable("paddingRight",  gapVar);

return { createdNodeIds: [grid.id] };
```

Add children: each card should have `layoutSizingHorizontal = "FILL"` and an explicit `minWidth` or fixed width.

---

## Sidebar + content split

```js
const layout = figma.createFrame();
layout.name = "Sidebar Layout";
layout.layoutMode = "HORIZONTAL";
layout.primaryAxisSizingMode = "FIXED";
layout.counterAxisSizingMode = "FIXED";
layout.resize(1440, 900);
layout.itemSpacing = 0;
layout.paddingTop = layout.paddingBottom = layout.paddingLeft = layout.paddingRight = 0;

// Sidebar
const sidebar = figma.createFrame();
sidebar.name = "Sidebar";
sidebar.layoutMode = "VERTICAL";
sidebar.primaryAxisSizingMode = "FILL";    // NOTE: must append first
sidebar.counterAxisSizingMode = "FIXED";
sidebar.resize(240, sidebar.height);

// Content area
const content = figma.createFrame();
content.name = "Content";
content.layoutMode = "VERTICAL";
content.primaryAxisSizingMode = "FILL";

layout.appendChild(sidebar);
layout.appendChild(content);

// FILL must be set AFTER appendChild
sidebar.layoutSizingVertical   = "FILL";
content.layoutSizingHorizontal = "FILL";
content.layoutSizingVertical   = "FILL";

return { createdNodeIds: [layout.id, sidebar.id, content.id] };
```

---

## Vertically stacked section with hero

```js
const section = figma.createFrame();
section.name = "Hero Section";
section.layoutMode = "VERTICAL";
section.primaryAxisSizingMode  = "HUG";
section.counterAxisSizingMode  = "FIXED";
section.counterAxisAlignItems  = "CENTER";   // center-align children
section.primaryAxisAlignItems  = "MIN";
section.resize(1440, section.height);

const paddingV = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_80");
const paddingH = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_160");
const gap      = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_32");

section.setBoundVariable("paddingTop",    paddingV);
section.setBoundVariable("paddingBottom", paddingV);
section.setBoundVariable("paddingLeft",   paddingH);
section.setBoundVariable("paddingRight",  paddingH);
section.setBoundVariable("itemSpacing",   gap);

// Background color
const bgVar = await figma.variables.importVariableByKeyAsync("VAR_KEY_BG_DEFAULT");
const newFill = figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 1 },
  "color", bgVar
);
section.fills = [newFill];

return { createdNodeIds: [section.id] };
```

---

## Auto-layout inside a component instance

When creating a new component that wraps other elements:

```js
const comp = figma.createComponent();
comp.name = "MyCard";
comp.layoutMode = "VERTICAL";
comp.primaryAxisSizingMode = "HUG";
comp.counterAxisSizingMode = "FIXED";
comp.resize(320, comp.height);

// Bind tokens
const pad = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_16");
comp.setBoundVariable("paddingTop",    pad);
comp.setBoundVariable("paddingBottom", pad);
comp.setBoundVariable("paddingLeft",   pad);
comp.setBoundVariable("paddingRight",  pad);

const gap = await figma.variables.importVariableByKeyAsync("VAR_KEY_SPACE_8");
comp.setBoundVariable("itemSpacing", gap);

// Corner radius
const radius = await figma.variables.importVariableByKeyAsync("VAR_KEY_RADIUS_MD");
comp.setBoundVariable("topLeftRadius",     radius);
comp.setBoundVariable("topRightRadius",    radius);
comp.setBoundVariable("bottomLeftRadius",  radius);
comp.setBoundVariable("bottomRightRadius", radius);

return { createdNodeIds: [comp.id] };
```

---

## Overflow scroll container

```js
const scrollContainer = figma.createFrame();
scrollContainer.name = "Scroll Container";
scrollContainer.layoutMode = "VERTICAL";
scrollContainer.primaryAxisSizingMode = "FIXED";
scrollContainer.counterAxisSizingMode = "FIXED";
scrollContainer.resize(400, 600);
scrollContainer.overflowDirection = "VERTICAL"; // enables vertical scroll
scrollContainer.clipsContent = true;

return { createdNodeIds: [scrollContainer.id] };
```

---

## Layout violation detector

Run this on any frame to surface auto layout violations.
**Important**: only checks `FRAME` and `COMPONENT` nodes (things you built) — `INSTANCE` nodes are intentionally excluded because their internal layout is controlled by their master component and should never be modified.

```js
const frame = await figma.getNodeByIdAsync("FRAME_ID");
const violations = [];

// Only check FrameNode and ComponentNode — never check InstanceNode internals
frame.findAll(n => n.type === "FRAME" || n.type === "COMPONENT").forEach(f => {
  if (f.layoutMode === "NONE") violations.push({ id: f.id, name: f.name, issue: "layoutMode=NONE" });
  if (f.paddingTop > 0 && !f.boundVariables?.paddingTop)
    violations.push({ id: f.id, name: f.name, issue: `hardcoded paddingTop=${f.paddingTop}` });
  if (f.itemSpacing > 0 && !f.boundVariables?.itemSpacing)
    violations.push({ id: f.id, name: f.name, issue: `hardcoded itemSpacing=${f.itemSpacing}` });
});

return violations.length > 0 ? violations : "No violations found ✓";
```
