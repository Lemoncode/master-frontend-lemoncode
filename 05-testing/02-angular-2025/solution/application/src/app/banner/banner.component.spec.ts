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

  it("should display original title", () => {
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title());
  });

  it("should display a different test title", () => {
    component.title.set("Other");
    fixture.detectChanges();
    expect(h1.textContent).toContain("Other");
  });
});