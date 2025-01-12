# Basic of testing components

A component, unlike all other parts of an Angular application, combines an HTML template and a TypeScript class. The component truly is the template and the class working together. To adequately test a component, you should test that they work together as intended.

Such tests require creating the component's host element in the browser DOM, as Angular does, and investigating the component class's interaction with the DOM as described by its template.

In many cases, testing the component class alone, without DOM involvement, can validate much of the component's behavior in a straightforward, more obvious way.

## Component DOM testing

### CLI-generated tests

The CLI creates an initial test file for you by default when you ask it to generate a new component.

```bash
npx ng generate component banner --inline-template --inline-style
```

Generates an initial test

```ts
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BannerComponent } from "./banner.component";

describe("BannerComponent", () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

> `compileComponents` is async, it uses [`waitForAsync`](https://angular.dev/api/core/testing/waitForAsync)

### Reduce the setup

We can reduce the file size, since we don not need to compile the component.

Update `app/banner/banner.component.spec.ts`

```ts
import { TestBed } from "@angular/core/testing";

import { BannerComponent } from "./banner.component";

describe("BannerComponent", () => {
  it("should create", () => {
    TestBed.configureTestingModule({ imports: [BannerComponent] });
    const fixture = TestBed.createComponent(BannerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

> There's no need to declare or import anything else. The default test module is pre-configured with something like the `BrowserModule` from `@angular/platform-browser`.

### `createComponent()`

`TestBed.createComponent()` creates an instance of the `BannerComponent`, adds a corresponding element to the test-runner DOM, and returns a `ComponentFixture`.

> IMPORTANT: Do not re-configure TestBed after calling `createCompnent`

The `createComponent` method **freezes the current TestBed definition**, closing it to further configuration.

You cannot call any more TestBed configuration methods, not `configureTestingModule()`, nor `get()`, nor any of the override... methods. If you try, `TestBed` throws an error.

### `ComponentFixture`

[ComponentFixture](https://angular.dev/api/core/testing/ComponentFixture) s a test harness for interacting with the created component and its corresponding element.

### `beforeEach()`

We can use `beforeEach` for the `TestBed` configuration

Update `banner.component.spec.ts`

```diff
describe('BannerComponent', () => {
+ let component: BannerComponent;
+ let fixture: ComponentFixture<BannerComponent>;
+
+ beforeEach(() => {
+   TestBed.configureTestingModule({ imports: [BannerComponent] });
+   fixture = TestBed.createComponent(BannerComponent);
+   component = fixture.componentInstance;
+ });
+
  it('should create', () => {
-   TestBed.configureTestingModule({ imports: [BannerComponent] });
-   const fixture = TestBed.createComponent(BannerComponent);
-   const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

### `nativeElement`

We can retrieve the component's element using `fixture.nativeElement`

Update `banner.component.spec.ts`

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain("banner works!");
});
```

```bash
npx ng test --include app/banner/banner.component.spec.ts
```

Angular can't know at compile time what kind of HTML element the nativeElement is or if it even is an HTML element. The application might be running on a _non-browser platform_, such as the server or a Web Worker, where the element might have a diminished API or not exist at all.

The tests in this guide are designed to run in a browser so a `nativeElement` value will always be an `HTMLElement` or one of its derived classes.

Knowing that it is an `HTMLElement` of some sort, use the standard HTML `querySelector` to dive deeper into the element tree.

Update `banner.component.spec.ts`

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector("p");
  expect(p?.textContent).toContain("banner works!");
});
```

### `DebugElement`

The Angular _fixture_ provides the component's element directly through the `fixture.nativeElement`.

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

This is actually a convenience method, implemented as `fixture.debugElement.nativeElement`.

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

The properties of the `nativeElement` depend upon the runtime environment. You could be running these tests on a _non-browser_ platform that doesn't have a DOM or whose DOM-emulation doesn't support the full HTMLElement API.

Angular relies on the DebugElement abstraction to work safely across _all supported platforms_. Instead of creating an HTML element tree, Angular creates a DebugElement tree that wraps the native elements for the runtime platform. The `nativeElement` property unwraps the `DebugElement` and returns the platform-specific element object.

Update `banner.component.spec.ts`

```diff
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
+import { DebugElement } from '@angular/core';
....
```

```ts
it("should find the <p> with fixture.debugElement.nativeElement)", () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector("p")!;
  expect(p.textContent).toContain("banner works!");
});
```

### `By.css()`

Although the tests in this guide all run in the browser, some applications might run on a different platform at least some of the time.

For example, the component might render first on the server as part of a strategy to make the application launch faster on poorly connected devices. The server-side renderer might not support the full HTML element API. If it doesn't support `querySelector`, the previous test could fail.

The DebugElement offers query methods that work for all supported platforms. These query methods take a _predicate_ function that returns true when a node in the DebugElement tree matches the selection criteria.

Update `banner.component.spec.ts`

```diff
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { DebugElement } from '@angular/core';
+import { By } from '@angular/platform-browser';
....
```

```ts
it("should find the <p> with fixture.debugElement.query(By.css)", () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css("p"));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toContain("banner works!");
});
```

- The `By.css()` static method selects `DebugElement` nodes with a [standard CSS selector](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors)
- The query returns a `DebugElement` for the paragraph
- You must unwrap the result to get the paragraph element

When you're filtering by CSS selector and only testing properties of a browser's _native element_, the `By.css` approach might be overkill.

It's often more straightforward and clear to filter with a standard HTMLElement method such as `querySelector()` or `querySelectorAll()`.
