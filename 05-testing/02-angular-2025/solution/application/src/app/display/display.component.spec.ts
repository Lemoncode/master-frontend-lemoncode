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