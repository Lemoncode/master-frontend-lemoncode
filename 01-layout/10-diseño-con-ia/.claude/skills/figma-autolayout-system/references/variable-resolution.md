# Variable Resolution Guide

When binding spacing, color, or radius values, follow this resolution order. Never skip to a lower step without exhausting the one above it.

---

## Resolution Order

### 1. Inspect existing screens (most authoritative)

```js
// Walk bound variables in an existing reference frame
const frame = figma.currentPage.findOne(n => n.name === "Reference Screen");
const varMap = new Map();

frame.findAll(() => true).forEach(node => {
  const bv = node.boundVariables;
  if (!bv) return;
  Object.entries(bv).forEach(([prop, binding]) => {
    const b = Array.isArray(binding) ? binding[0] : binding;
    if (b?.id) varMap.set(`${node.name}.${prop}`, b.id);
  });
});
return [...varMap.entries()];
```

### 2. search_design_system (library variables)

Run multiple parallel short queries — library naming varies wildly:

**Spacing / layout:**
```
"space"   "spacing"   "gap"   "padding"   "inset"   "size"
```

**Color:**
```
"gray"   "grey"   "blue"   "red"   "green"   "brand"
"background"   "foreground"   "surface"   "border"   "text"   "neutral"
```

**Radius:**
```
"radius"   "corner"   "round"   "pill"
```

### 3. getLocalVariableCollectionsAsync (local only)

Only for files that define their own token system locally:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const vars = [];
for (const col of collections) {
  for (const id of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    vars.push({ name: v.name, id: v.id, key: v.key, resolvedType: v.resolvedType });
  }
}
return vars;
```

### 4. Create local variables (last resort)

Only if the file has no library and no local tokens. Always assign specific scopes:

```js
const col = figma.variables.createVariableCollection("Tokens");
const spaceVar = figma.variables.createVariable("space/400", col, "FLOAT");
spaceVar.setValueForMode(col.defaultModeId, 16);
spaceVar.scopes = ["GAP"];  // never ALL_SCOPES
```

---

## Binding Cheat-Sheet

### Spacing (paddingTop, paddingBottom, paddingLeft, paddingRight, itemSpacing)

```js
const v = await figma.variables.importVariableByKeyAsync("VAR_KEY");
frame.setBoundVariable("paddingTop",    v);
frame.setBoundVariable("paddingBottom", v);
frame.setBoundVariable("paddingLeft",   v);
frame.setBoundVariable("paddingRight",  v);
frame.setBoundVariable("itemSpacing",   v);
```

### Color fill

```js
const colorVar = await figma.variables.importVariableByKeyAsync("COLOR_VAR_KEY");
const fills = [...node.fills];
const newFill = figma.variables.setBoundVariableForPaint(fills[0] ?? { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 1 }, "color", colorVar);
node.fills = [newFill];
```

### Border radius

```js
const r = await figma.variables.importVariableByKeyAsync("RADIUS_VAR_KEY");
node.setBoundVariable("topLeftRadius",     r);
node.setBoundVariable("topRightRadius",    r);
node.setBoundVariable("bottomLeftRadius",  r);
node.setBoundVariable("bottomRightRadius", r);
```

### Stroke color

```js
const strokeVar = await figma.variables.importVariableByKeyAsync("BORDER_COLOR_KEY");
const strokes = [...node.strokes];
const newStroke = figma.variables.setBoundVariableForPaint(strokes[0] ?? { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 }, "color", strokeVar);
node.strokes = [newStroke];
```

---

## Common Pitfalls

| Problem | Fix |
|---------|-----|
| `getLocalVariableCollectionsAsync()` returns empty | Library variables are remote — use `search_design_system` instead |
| `importVariableByKeyAsync` throws | Key is wrong or library not linked — re-run `search_design_system` to get current key |
| Variable bound but value not visible | Check variable scope — narrow it to the correct scope (e.g., `GAP`, `CORNER_RADIUS`) |
| `setBoundVariableForPaint` result not applied | Must capture return value and reassign: `node.fills = [newFill]` |
