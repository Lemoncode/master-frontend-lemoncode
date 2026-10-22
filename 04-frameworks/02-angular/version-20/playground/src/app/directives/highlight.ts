import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class Highlight {
  // color = 'lightblue';
  @Input('appHighlight')
  public color!: string;

  private defaultColor = 'lightblue';

  constructor(private el: ElementRef) {
    // (el.nativeElement as HTMLElement).style.backgroundColor = 'lightblue';
  }

  private highlight(color: string) {
    (this.el.nativeElement as HTMLElement).style.backgroundColor = color;
  }

  @HostListener('mouseenter')
  onMouseEneterEvent() {
    this.highlight(this.color || this.defaultColor);
  }

  @HostListener('mouseleave')
  onMouseLeaveEvent() {
    this.highlight('');
  }
}
