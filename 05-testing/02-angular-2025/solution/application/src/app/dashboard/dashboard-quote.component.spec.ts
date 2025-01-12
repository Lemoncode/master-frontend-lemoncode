import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuoteComponent } from './dashboard-quote.component';

describe('DashboardQuoteComponent', () => {
  let component: DashboardQuoteComponent;
  let fixture: ComponentFixture<DashboardQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
