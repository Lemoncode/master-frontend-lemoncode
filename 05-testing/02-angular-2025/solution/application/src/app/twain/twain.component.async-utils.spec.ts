import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
  } from '@angular/core/testing';
  
  import { TwainComponent } from './twain.component';
  import { TwainService } from './twain.service';
  import { defer, of } from 'rxjs';
  import { provideHttpClient } from '@angular/common/http';
  import { asyncData, asyncError } from '../async-observable-helpers';
  
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
  
    describe('when test with synchronous observable', () => {
      it('should not show quote before OnInit', () => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('');
        expect(errorEl).withContext('should not show error element').toBeNull();
        expect(getQuoteSpy.calls.any())
          .withContext('getQuote not yet called')
          .toBe(false);
      });
  
      // The quote would not be immediately available if the service were truly async.
      it('should show quote after component initialized', async () => {
        fixture.detectChanges();
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        await fixture.whenStable();
  
        // sync spy result shows testQuote immediately after init
        expect(quoteEl.textContent).toBe(testQuote);
        expect(getQuoteSpy.calls.any()).withContext('getQuote called').toBe(true);
      });
  
      // The error would not be immediately available if the service were truly async.
      // Use `fakeAsync` because the component error calls `setTimeout`
      it('should display error when TwainService fails', fakeAsync(() => {
        getQuoteSpy.and.returnValue(
          defer(() => {
            return new Promise((_, reject) => {
              setTimeout(() => {
                reject('TwainService test failure');
              });
            });
          })
        );
  
        fixture.detectChanges(); // onInit();
  
        tick(); // flush the setTimeout()
  
        fixture.detectChanges(); // update errorMessage
  
        const errorEl = fixture.nativeElement.querySelector('.error');
        const quoteEl = fixture.nativeElement.querySelector('.twain');
  
        expect(errorEl.textContent)
          .withContext('should display error')
          .toMatch(/test failure/);
        expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');
      }));
    });
  
    describe('when test asynchronous observable', () => {
      beforeEach(() => {
        getQuoteSpy.and.returnValue(asyncData(testQuote));
      });
  
      it('should not show quote before OnInit', () => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('');
        expect(errorEl).withContext('should not show error element').toBeNull();
        expect(getQuoteSpy.calls.any())
          .withContext('getQuote not yet called')
          .toBe(false);
      });
  
      it('should still not show quote after component initialized', () => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        fixture.detectChanges();
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('...');
        expect(errorEl).withContext('should not show error element').toBeNull();
        expect(getQuoteSpy.calls.any())
          .withContext('getQuote not yet called')
          .toBe(true);
      });
  
      it('should show quote after getQuote (fakeAsync)', fakeAsync(() => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        fixture.detectChanges(); // nOnInit
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('...');
  
        tick(); // flush the observable to get the quote
        fixture.detectChanges(); // update view
  
        expect(quoteEl.textContent)
          .withContext('should show quote')
          .toBe(testQuote);
        expect(errorEl).withContext('should not show error element').toBeNull();
      }));
  
      it('should show quote after getQuote (async)', async () => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        fixture.detectChanges(); // ngOnInit
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('...');
  
        await fixture.whenStable();
        fixture.detectChanges(); // update view with quote
        expect(quoteEl.textContent)
          .withContext('should show quote')
          .toBe(testQuote);
        expect(errorEl).withContext('should not show error element').toBeNull();
      });
  
      // TODO: Have a deeper look
      // TODO: Implement using 'async'
      it('should display error when TwainService fails', fakeAsync(() => {
        const quoteEl = fixture.nativeElement.querySelector('.twain');
        const errorEl = fixture.nativeElement.querySelector('.error');
        getQuoteSpy.and.returnValue(
          asyncError<string>('TwainService test failure')
        );
  
        fixture.detectChanges(); // ngOnInit
        tick(); // flush the observable
        fixture.detectChanges();
        
        expect(quoteEl.textContent).withContext('nothing displayed').toBe('...');
        console.log(errorEl)
      //   expect(errorEl.textContent)
      //     .withContext('should display error')
      //     .toMatch(/test failure/);
      }));
    });
  });
  