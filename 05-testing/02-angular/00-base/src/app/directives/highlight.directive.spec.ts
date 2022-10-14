import { HighlightDirective } from './highlight.directive';
import { ElementRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

xdescribe('HighlightDirective', () => {

  it('sin indicar color, al poner el ratón encima, el objeto debe colorearse del color por defecto', () => {
    
    // Setup
    

    // Act
   

    // Assert
    
  });

  it('si se indica color, al poner el ratón encima, el objeto debe colorearse del color indicado', () => {
    
    
  });

  it('sin indicar color, al poner el ratón encima, y luego quitar el ratón, el objeto pierde el color', () => {
    
    
  });
});

// @Component({
//   template: `
//     <h2 appHighlight="yellow">Something Yellow</h2>
//     <h2 appHighlight>The Default (lightblue)</h2>
//     <h2>No Highlight</h2>
//   `
// })
// class TestComponent { }


// describe('probando la directiva en el DOM', () => {
//   it('sin indicar color, cuando se ponga el ratón encima, se debería resaltar con el color por defecto', () => {
//     // Setup
//     const fixture: ComponentFixture<TestComponent> = TestBed.configureTestingModule({
//         declarations: [ HighlightDirective, TestComponent ]
//     })
//     .createComponent(TestComponent);
//     fixture.detectChanges();

//     // Act
//     //const elements = fixture.debugElement.queryAll(By.css('h2[appHighlight]'));
//     const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
//     expect(elements.length).toBe(2);

//     const primerH2 = elements[0].nativeElement;
//     primerH2.dispatchEvent(new Event('mouseenter'));
//     fixture.detectChanges();

//     // Assert
//     const color = primerH2.style.backgroundColor;
//     expect(color).toBe('yellow');


//     const segundoH2 = elements[1].nativeElement;
//     segundoH2.dispatchEvent(new Event('mouseenter'));
//     fixture.detectChanges();

//     // Assert
//     const color2 = segundoH2.style.backgroundColor;
//     expect(color2).toBe('lightblue');
//   });
// });