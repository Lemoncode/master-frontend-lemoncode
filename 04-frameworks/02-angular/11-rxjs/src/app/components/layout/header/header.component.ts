import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  numItems: number;
  total: number;
  constructor(private shoppingCartService: ShoppingCartService) {

    this.numItems = this.shoppingCartService.getNumItems();
    this.total = this.shoppingCartService.getTotal();
    // this.shoppingCartService.getNumItems$().subscribe(
    //   nuevoNumero => this.numItems = nuevoNumero
    // );

    // this.shoppingCartService.getTotal$().subscribe(
    //   nuevoPrecio => this.total = nuevoPrecio
    // );
  }

  ngOnInit(): void {
  }

  // ngDoCheck() {
  //   this.numItems = this.shoppingCartService.getNumItems();
  //   this.total = this.shoppingCartService.getTotal();
  // }

}
