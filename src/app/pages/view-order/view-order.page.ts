import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface } from 'src/app/interfaces/user';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  item:any;
  user:UserInterface;
  price_total = 0;

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    this.item = this.route.getCurrentNavigation().extras.state.item;
    this.user = this.route.getCurrentNavigation().extras.state.user;
    console.log("Order-item", this.item);
  }

  ionViewDidEnter(){
    let prices_order = [];

    this.item.orders.forEach(order => {
      order.products.forEach(product => {
        if(product.variant !== null) {
          prices_order = prices_order.concat(product.variant.price * product.amount);
        } else {
          prices_order = prices_order.concat(product.product.price * product.amount);
        }
      });

      let prices_adds = order.additionals.map(add => {
        return add.additional.price * add.amount;
      });

      let prices_menus = order.menus.map(menu => {
        return menu.category.price * menu.amount;
      });

      prices_order = prices_order.concat(prices_adds).concat(prices_menus);
    });

    if(prices_order.length > 0){
      this.price_total = prices_order.reduce((prev, curr) => prev + curr);
    }

  }

}
