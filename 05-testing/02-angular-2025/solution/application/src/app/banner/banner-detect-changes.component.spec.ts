import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
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
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('should display original title', () => {
    expect(h1.textContent).toContain(component.title());
  });

  it('should still see original title after comp.title change', async () => {
    const oldTitle = component.title();
    const newTitle = 'Other';
    component.title.set(newTitle);
    expect(h1.textContent).toContain(oldTitle);
    await fixture.whenStable();
    expect(h1.textContent).toContain(newTitle);
  });

  it('should sisplay updated title after detectChanges', () => {
    component.title.set('Other');
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title());
  });
});
