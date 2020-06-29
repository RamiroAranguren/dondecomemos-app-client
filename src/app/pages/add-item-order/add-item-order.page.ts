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
  additionals:any[] = [];

  cantProduct = 1;
  cantProductVariant = 0;
  cantProductAdd = 0;

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

    // VARIANTES
    let variante = {
      name: "",
      value: []
    };
    let option = [];
    this.product.variants.forEach(vary => {
      if (vary.variants_product_list.name !== variante.name) {
        option.push({"id": vary.id, "name": vary.name, "price": vary.price});
        variante.name = vary.variants_product_list.name;
        variante.value = option;
      } else {
        variante.value.push({"id": vary.id, "name": vary.name, "price": vary.price});
      }

    });
    this.variants.push(variante);

    // ADDITIONALS
    let additional = {
      item: {name: "", type: "", amount: 0},
      value: []
    };
    let option_add = [];
    this.product.additional_products.forEach(addit => {
      if (addit.additional_product.name !== additional.item.name) {
        option_add.push({"id": addit.id, "name": addit.name, "price": addit.price});
        additional.item.name = addit.additional_product.name;
        additional.item.type = addit.additional_product.type;
        additional.item.amount = addit.additional_product.amount;
        additional.value = option_add;
      } else {
        additional.value.push({"id": addit.id, "name": addit.name, "price": addit.price});
      }

    });
    this.additionals.push(additional);
    console.log("ADDS", this.additionals);
  }

  cancelItem() {
    console.log("Cancel Item");
    this.navCtrl.back();
  }

  addCantProduct(event) {
    this.cantProduct += 1;
  }

  removeCantProduct(event) {
    if(this.cantProduct >= 2)
      this.cantProduct -= 1;
  }

  addCantVariant(item, idSelect) {
    console.log("add", this.cantProduct, item, idSelect);
    this.cantProductVariant += 1;
    let idElement = `count-variant-${idSelect}`;
    console.log(idElement);
    let element = document.getElementById(idElement);
    element.innerHTML=this.cantProductVariant.toString();
  }

  removeCantVariant(item, idSelect) {
    console.log("remove", this.cantProduct, item, idSelect);
    if(this.cantProductVariant >= 1)
      this.cantProductVariant -= 1;
    let idElement = `count-variant-${idSelect}`;
    console.log(idElement);
    let element = document.getElementById(idElement);
    element.innerHTML=this.cantProductVariant.toString();
  }

  addCantAdd(item, idSelect) {
    console.log("add", this.cantProduct, item, idSelect);
    this.cantProductAdd += 1;
  }

  removeCantAdd(item, idSelect) {
    console.log("remove", this.cantProduct, item, idSelect);
    if(this.cantProductAdd >= 1)
      this.cantProductAdd -= 1;
  }

}
