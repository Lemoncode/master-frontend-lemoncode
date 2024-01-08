import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from './product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'signals-lab';

  quantity = signal(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);
  selectedProduct = signal<Product>({ id: 1, name: 'Foo', price: 12 });
  exPrice = computed(() => this.selectedProduct().price * this.quantity());
  color = computed(() => (this.exPrice() > 50 ? 'green' : 'blue'));

  e = effect(() => console.log('In effect, price:', this.exPrice()))

  constructor() {
    console.log(`Signals value ${this.quantity()}`);

    effect(() => console.log('In effect: ', this.quantity()));

    this.quantity.update((q) => q * 2);
  }

  onQuantitySelected($event: number): void {
    this.quantity.set($event);
    // this.quantity.set(67);
    // this.quantity.set(42);
  }
}
