# Testing Pipes

> You can test pipes without the Angular testing utilities

```bash
npx ng g p titlecase
```

Update `titlecase.pipe.ts`

```ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "titlecase",
  pure: true,
})
export class TitlecasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ""
      : input.replace(
          /\w\S*/g,
          (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase()
        );
  }
}
```

Update `titlecase.pipe.spec.ts`

```ts
import { TitlecasePipe } from './titlecase.pipe';

describe('TitlecasePipe', () => {
  const pipe = new TitlecasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });
  
  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });
});

```

```bash
npx ng test --include app/titlecase.pipe.spec.ts
```

## Writing DOM tests to support a pipe test

Previous tests are working in isolation. They can't tell if the `TitleCasePipe` is working properly as applied in the application components.

### Exercise 

Create a component that uses `HighlightDirective` and create a test that ensures that the directive is applied.