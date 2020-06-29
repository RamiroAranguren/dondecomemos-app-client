import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-add-item-order',
  templateUrl: './add-item-order.page.html',
  styleUrls: ['./add-item-order.page.scss'],
})
export class AddItemOrderPage implements OnInit {

  category_name:string;
  product:any;
  comments = "";

  variants:any[] = [];
  additionals:any[] = [];

  order:any[] = [];

  count_variants = {};
  count_additionals = {};

  counters_add:any;
  counters_var:any;

  cantProduct = 1;
  cantProductVariant = 0;
  cantProductAdd = 0;

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.category_name = this.route.getCurrentNavigation().extras.state.category_name;
    this.product = this.route.getCurrentNavigation().extras.state.product;

    console.log("PRD", this.product);
    this.storage.getObject("list_order").then(orders => {
      console.log("ACAAA", orders);
      this.order = orders || [];
    });

    console.log("ORDERS-STORE", this.order);
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
      this.count_variants[vary.name] = 0;
    });
    this.counters_var = this.count_variants;
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
      this.count_additionals[addit.name] = 0;
    });
    this.counters_add = this.count_additionals;
    this.additionals.push(additional);
    console.log("ADDS", this.additionals);
    console.log("VARI-COUNT", this.counters_var);
    console.log("ADD-COUNT", this.counters_add);
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

  addCantVariant(idSelect, name) {
    if(this.counters_var[name] < this.cantProduct) {
      this.counters_var[name] += 1;
      this.cantProductVariant = this.counters_var[name];
      let idElement = `count-variant-${idSelect}`;
      console.log(idElement);
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductVariant.toString();
    }
  }

  removeCantVariant(idSelect, name) {
    if(this.counters_var[name] >= 1){
      this.counters_var[name] -= 1;
      this.cantProductVariant = this.counters_var[name];
      let idElement = `count-variant-${idSelect}`;
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductVariant.toString();
    }
  }

  addCantAdd(item, idSelect, name) {
    if(this.counters_add[name] < this.cantProduct){
      this.counters_add[name] += 1;
      this.cantProductAdd = this.counters_add[name];
      let idElement = `count-additional-${idSelect}`;
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductAdd.toString();
    }
  }

  removeCantAdd(item, idSelect, name) {
    if(this.counters_add[name] >= 1){
      this.counters_add[name] -= 1;
      this.cantProductAdd = this.counters_add[name];
      let idElement = `count-additional-${idSelect}`;
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductAdd.toString();
    }
  }

  addOrder() {
    this.order.push({
      product: {
        id: this.product.id,
        name: this.product.name,
        count: this.cantProduct,
        comments: this.comments,
        variants: [
          {
            id: 1,
            name: "sdsd",
            count: 1
          }
        ],
        additionals: [
          {
            id: 1,
            name: "sdsd",
            count: 1
          }
        ]
      }
    });

    this.storage.addObject("list_order", this.order);
  }

}
