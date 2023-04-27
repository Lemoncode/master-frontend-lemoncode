# Rows Columns

Partiendo del ejemplo anterior vamos a configurarlo.

```diff
.grid-container {
  display: grid;
+ grid-template-columns: 100px 100px 300px;
+ grid-template-rows: 100px 100px;
}
```

explicar el repeat

```css
  grid-template-columns: repeat(3, 100px 50px);
```
