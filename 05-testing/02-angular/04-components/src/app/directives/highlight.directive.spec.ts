import { HighlightDirective } from './highlight.directive';
import { ElementRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <h2 appHighlight="yellow">Something Yellow</h2>
    <h2 appHighlight>The Default (lightblue)</h2>
    <h2>No Highlight</h2>
  `
})
class TestComponent { }

describe('HighlightDirective', () => {
  it('When calling onMouseEnterEvent(), the element is highlighted', () => {
    const p = document.createElement('p');
    const element = new ElementRef(p);
    const directive = new HighlightDirective(element);
    directive['color'] = 'orange';
    directive.onMouseEnterEvent();

    expect(element.nativeElement.style.backgroundColor).toBe('orange');
  });

  it('When calling onMouseLeave(), the element is un-highlighted', () => {
    const p = document.createElement('p');
    const element = new ElementRef(p);
    const directive = new HighlightDirective(element);
    directive['color'] = 'orange';
    directive.onMouseEnterEvent();
    directive.onMouseLeaveEvent();

    expect(element.nativeElement.style.backgroundColor).toBe('');
  });

  it('Probando la directiva en el DOM', () => {
    const fixture: ComponentFixture<TestComponent> = TestBed.configureTestingModule({
      declarations: [ HighlightDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges(); // Forzamos detección de cambios para hacer el binding inicial

    // Array de elementos a los que se le aplica la direciva
    const elems = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    expect(elems.length).toBe(2);

    // Primer h2
    elems[0].nativeElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    const bgColorEnter = elems[0].nativeElement.style.backgroundColor;
    expect(bgColorEnter).toBe('yellow');

    elems[0].nativeElement.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    const bgColorLeave = elems[0].nativeElement.style.backgroundColor;
    expect(bgColorLeave).toBe('');

    // Este es el h2 al que no se aplica la directiva
    const bareH2 = fixture.debugElement.query(By.css('h2:not([appHighlight])'));
    bareH2.nativeElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    const bgColorbareH2 = bareH2.nativeElement.style.backgroundColor;
    expect(bgColorbareH2).toBe('');

  });
});
