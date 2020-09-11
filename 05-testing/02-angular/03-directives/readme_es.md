# Testeo de directivas

Las directivas también son objetos, así que también aplicaremos las mismas técnicas de testeo unitario:

- mockear posibles dependencia
- inyectar los mocks en el constructor

## Ejemplo

Vamos a testear la directiva _HighlightDirective_. Este es su código.

_src/app/directives/highlight.directive.ts_

```typescript
import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @Input('appHighlight')
  private color;

  private defaultColor = 'lightblue';

  constructor(private el: ElementRef) { }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @HostListener('mouseenter')
  onMouseEnterEvent(): void {
    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent(): void {
    this.highlight('');
  }

}
```

Testearemos que los métodos onMouseEnterEvent() y onMouseLeaveEvent() funcionan correctamente.

_src/app/directives/highlight.directive.spec.ts_

```typescript
import { HighlightDirective } from './highlight.directive';
import { ElementRef, Component } from '@angular/core';

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
});
```

No es difícil. Como siempre, si tuviera dependencias las mockeamos y las inyectamos en el constructor.

## Probando la interacción con el DOM

Casi siempre las directivas se pretenden utilizar para alterar el DOM del algún elemento.

Para probar la interacción de la directiva con el DOM necesitamos herramientas adicionales de testeo que provee Angular.

_src/app/directives/highlight.directive.spec.ts_

```diff
import { HighlightDirective } from './highlight.directive';
import { ElementRef, Component } from '@angular/core';
+ import { ComponentFixture, TestBed } from '@angular/core/testing';
+ import { By } from '@angular/platform-browser';

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
});
```

Y la técnica aquí será utilizar un componente (mock) expresamente creado para testear esta directiva, configurar un módulo que contenga a este componente mock y a la directiva real, y realizar las pruebas en ese entorno simulado que acabmos de probar.

```diff
import { HighlightDirective } from './highlight.directive';
import { ElementRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

+ @Component({
+   template: `
+     <h2 appHighlight="yellow">Something Yellow</h2>
+     <h2 appHighlight>The Default (lightblue)</h2>
+     <h2>No Highlight</h2>
+   `
+ })
+ class TestComponent { }

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

+  it('Probando la directiva en el DOM', () => {
+    const fixture: ComponentFixture<TestComponent> = TestBed.configureTestingModule({
+      declarations: [ HighlightDirective, TestComponent ]
+    })
+    .createComponent(TestComponent);
+
+    fixture.detectChanges(); // Forzamos detección de cambios para hacer el binding inicial
+
+    // Array de elementos a los que se le aplica la direciva
+    const elems = fixture.debugElement.queryAll(By.directive(HighlightDirective));
+
+    expect(elems.length).toBe(2);
+
+    // Primer h2
+    elems[0].nativeElement.dispatchEvent(new Event('mouseenter'));
+    fixture.detectChanges();
+    const bgColorEnter = elems[0].nativeElement.style.backgroundColor;
+    expect(bgColorEnter).toBe('yellow');
+
+    elems[0].nativeElement.dispatchEvent(new Event('mouseleave'));
+    fixture.detectChanges();
+    const bgColorLeave = elems[0].nativeElement.style.backgroundColor;
+    expect(bgColorLeave).toBe('');
+
+    // Este es el h2 al que no se aplica la directiva
+    const bareH2 = fixture.debugElement.query(By.css('h2:not([appHighlight])'));
+    bareH2.nativeElement.dispatchEvent(new Event('mouseenter'));
+    fixture.detectChanges();
+    const bgColorbareH2 = bareH2.nativeElement.style.backgroundColor;
+    expect(bgColorbareH2).toBe('');
+  });
});
```