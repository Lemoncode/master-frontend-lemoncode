import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwainComponent } from './twain.component';
import { provideHttpClient } from '@angular/common/http';
import { TwainService } from './twain.service';
import { of, throwError } from 'rxjs';

describe('TwainComponent', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let testQuote: string;
  let getQuoteSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TwainComponent],
      providers: [TwainService, provideHttpClient()],
    });
    testQuote = 'Test Quote';

    // Create a fake TwainService object with `getQuote()` spy
    const twainService = TestBed.inject(TwainService);
    getQuoteSpy = spyOn(twainService, 'getQuote').and.returnValue(
      of(testQuote)
    );

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
  });

  it('should display error when TwainService fails', () => {
    getQuoteSpy.and.returnValue(throwError(() => 'Test fails'));
    fixture.detectChanges(); // ngOnInit
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement.textContent)
      .withContext('should display error')
      .toContain('Test fails');
  });

  it('should show quote after getQuote', () => {
    fixture.detectChanges(); // ngOnInit()
    const element = fixture.nativeElement.querySelector('.twain');
    expect(element.textContent)
      .withContext('should show quote')
      .toBe(testQuote);
  });
});
