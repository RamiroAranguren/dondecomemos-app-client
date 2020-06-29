import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-item-order',
  templateUrl: './add-item-order.page.html',
  styleUrls: ['./add-item-order.page.scss'],
})
export class AddItemOrderPage implements OnInit {

  category_name:string;
  product:any;
  variants:any[] = [];

  cantProduct = 1;
  cantProductSize = 0;

  constructor(
    private route: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.category_name = this.route.getCurrentNavigation().extras.state.category_name;
    this.product = this.route.getCurrentNavigation().extras.state.product;

    console.log("PRD", this.product);
  }

  ionViewDidEnter() {
    let variante = {};
    let option = [];
    this.product.variants.forEach(vary => {
      console.log("option", option);
      if (vary.variants_product_list.name in variante) {
        option.push({"name": vary.name, "price": vary.price});
        variante[vary.variants_product_list.name] = option;
      } else {
        option = [];
        option.push({"name": vary.name, "price": vary.price});
        variante[vary.variants_product_list.name] = option;
      }
      
    });
    console.log("variante_new", variante);
  }

  cancelItem() {
    console.log("Cancel Item");
    this.navCtrl.back();
  }

  addCantProduct() {
    this.cantProduct += 1;
  }

  removeCantProduct() {
    if(this.cantProduct >= 2)
      this.cantProduct -= 1;
  }

  addCount() {
    this.cantProductSize += 1;
  }

  removeCount() {
    if(this.cantProductSize >= 2)
      this.cantProductSize -= 1;
  }

}
