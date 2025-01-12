# Component binding

Refactor `app/banner/banner.component.ts`

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-banner",
  imports: [],
  template: `<h1>{{ title() }}</h1>`,
  styles: `
    h1 { color: green; font-size: 350%; }
  `,
})
export class BannerComponent {
  title = signal("Test demos");
}
```

### Query for the `<h1>`

Update `banner.component.spec.ts`

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BannerComponent } from "./banner.component";

describe("BannerComponent", () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BannerComponent] });
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector("h1");
  });
});
```

### `createComponent()` does not bind data

We would like to see if the data is displayed.

Update `banner.component.spec.ts`

```ts
it("should display original title", () => {
  expect(h1.textContent).toContain(component.title());
});
```

```bash
npx ng test --include app/banner/banner.component.spec.ts
```

The test fails with

```
expected '' to contain 'Test demos'.
```

Binding happens when Angular performs **change detection**. The `TestBed.createComponent` does not trigger change detection by default.

### `detectChanges()`

You can tell the `TestBed` to perform data binding by calling `fixture.detectChanges()`.

Update `banner.component.spec.ts`

```diff
....
  it('should display original title', () => {
+   fixture.detectChanges();
    expect(h1.textContent).toContain(component.title());
  });
....
```

Delayed change detection is intentional and useful. It gives the tester an opportunity to inspect and change the state of the component before Angular initiates data binding and calls lifecycle hooks.

Update `banner.component.spec.ts`

```ts
it("should display a different test title", () => {
  component.title.set("Other");
  fixture.detectChanges();
  expect(h1.textContent).toContain("Other");
});
```

### Automatic change detection

We can make that the test environment runs the test detection automatically.

That's possible by configuring the `TestBed` with the `ComponentFixtureAutoDetect` provider. First import it from the testing utility library:

```ts
import { ComponentFixtureAutoDetect } from "@angular/core/testing";
```

```ts
TestBed.configureTestingModule({
  providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
});
```

> NOTE: You can also use the `fixture.autoDetectChanges()` function instead if you only want to enable automatic change detection after making updates to the state of the fixture's component. In addition, automatic change detection is on by default when using provideExperimentalZonelessChangeDetection and turning it off is not recommended.

Create `banner-detect-changes.component.spec.ts`

```ts
import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from "@angular/core/testing";
import { BannerComponent } from "./banner.component";

describe("BannerComponent", () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
      imports: [BannerComponent],
    });
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector("h1");
  });

  it("should display original title", () => {
    expect(h1.textContent).toContain(component.title());
  });

  it("should still see original title after comp.title change", async () => {
    const oldTitle = component.title();
    const newTitle = "Other";
    component.title.set(newTitle);
    expect(h1.textContent).toContain(oldTitle);
    await fixture.whenStable();
    expect(h1.textContent).toContain(newTitle);
  });

  it("should sisplay updated title after detectChanges", () => {
    component.title.set("Other");
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title());
  });
});
```

The first test shows the benefit of automatic change detection.

The second and third test reveal an important limitation. The Angular testing environment does not run change detection synchronously when updates happen inside the test case that changed the component's title. The test must call await fixture.whenStable to wait for another of change detection.

```bash
npx ng test --include app/banner/banner-detect-changes.component.spec.ts
```

> NOTE: Angular does not know about direct updates to values that are not signals. The easiest way to ensure that change detection will be scheduled is to use signals for values read in the template.

### Change an innput value with `dispatchEvent()`

To simulate user input, find the input element and set its value property.

But there is an essential, intermediate step.

Angular doesn't know that you set the input element's value property. It won't read that property until you raise the element's input event by calling `dispatchEvent()`.

```bash
npx ng g c display  --inline-style --inline-template
```

Update `app/display/display.component.ts`

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-display",
  imports: [],
  template: `
    <input (input)="onChange($event)" />
    <span>{{ myInput() }}</span>
  `,
  styles: ``,
})
export class DisplayComponent {
  myInput = signal("");
  onChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.myInput.set(inputValue);
  }
}
```

Update `app/display/display.component.spec.ts`

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayComponent } from "./display.component";

describe("DisplayComponent", () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("should display the input entry", async () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("input");
    const display: HTMLElement = fixture.nativeElement.querySelector("span");

    input.value = "Jane";
    input.dispatchEvent(new Event("input"));

    await fixture.whenStable();

    expect(display.textContent).toBe("Jane");
  });
});
```

```bash
npx ng test --include app/display/display.component.spec.ts
```