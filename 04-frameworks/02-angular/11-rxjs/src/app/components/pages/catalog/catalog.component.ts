import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  catalog: Product[];
  constructor(private shoppingCartService: ShoppingCartService) {
    this.catalog = this.shoppingCartService.getCatalog();
  }

  ngOnInit() {
  }

  add(product) {
    this.shoppingCartService.addProduct(product);
  }

}
