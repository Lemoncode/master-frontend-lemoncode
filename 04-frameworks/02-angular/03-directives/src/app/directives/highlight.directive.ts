import { Directive, ElementRef, HostListener, Input } from '@angular/core';

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
  onMouseEnterEvent() {
    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.highlight('');
  }

}
