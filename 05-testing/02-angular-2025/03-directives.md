# Testing Attribute Directives

An _attribute directive_ modifies the behavior of an element, component or another directive. Its name reflects the way the directive is applied: as an attribute on a host element.

Create `HighlightDirective`

```bash
npx ng g d highlight
```

```ts
import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective implements OnChanges {
  defaultColor = "rgb(211, 211, 211)";

  @Input("appHighlight") bgColor = "";

  constructor(private el: ElementRef) {
    el.nativeElement.style.customProperty = true;
  }

  ngOnChanges(): void {
    this.el.nativeElement.style.backgroundColor =
      this.bgColor || this.defaultColor;
  }
}
```

The sample application's HighlightDirective sets the background color of an element based on either a data bound color or a default color (lightgray). It also sets a custom property of the element (`customProperty`) to `true` for no reason other than to show that it can.

A directive is going to manipulate the DOM, so iff we want to test a directive we need a DOM to get updated by its use case. The best approach is to create a component that reflects all use cases using the directive.

Update `highlight.directive.spec.ts`

```ts
import { Component } from "@angular/core";
import { HighlightDirective } from "./highlight.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
  template: `
    <h2 appHighlight="yellow">Something Yellow</h2>
    <h2 appHighlight>The default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [appHighlight]="box.value" value="cyan" />
  `,
  imports: [HighlightDirective],
})
class TestComponent {}

describe("HighlightDirective", () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [HighlightDirective, TestComponent],
    }).createComponent(TestComponent);
  });

  it("should have three highlighted elements", () => {
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );

    expect(elements.length).toBe(3);
  });

  it('should color 1st <h2> background "yellow"', () => {
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const bgColor = elements[0].nativeElement.style.backgroundColor;
    expect(bgColor).toBe("yellow");
  });

  it("should color 2nd <h2> background w/ default color", () => {
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const dir = elements[1].injector.get(
      HighlightDirective
    ) as HighlightDirective;
    const bgColor = elements[1].nativeElement.style.backgroundColor;
    expect(bgColor).toBe(dir.defaultColor);
  });

  it("should bind <input> background to value color", () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );

    const input = elements[2].nativeElement as HTMLInputElement;
    expect(input.style.backgroundColor)
      .withContext("initial backgroundColor")
      .toBe("cyan");

    input.value = "green";

    // Dispatch a DOM event so thatAngular responds to the input value change
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(input.style.backgroundColor)
      .withContext("initial backgroundColor")
      .toBe("green");
  });
});
```

```bash
npx ng test --include app/highlight.directive.spec.ts
```