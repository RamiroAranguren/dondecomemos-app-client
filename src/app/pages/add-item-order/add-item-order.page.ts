import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-add-item-order',
  templateUrl: './add-item-order.page.html',
  styleUrls: ['./add-item-order.page.scss'],
})
export class AddItemOrderPage implements OnInit {

  category_name:string;
  product:any;
  restaurant:any;
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
  counters:any;

  activeAgregate = true;

  constructor(
    private alertCtrl: AlertController,
    private route: Router,
    private navCtrl: NavController,
    private toast: ToastService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.category_name = this.route.getCurrentNavigation().extras.state.category_name;
    this.product = this.route.getCurrentNavigation().extras.state.product;
    this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;

    console.log("PRD", this.product);
    this.storage.getObject("list_order").then(res => {
      if(res)
        this.order = res;
    });
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
    this.product.additionals_products.forEach(addit => {
      addit.additionals_items.forEach(item => {
        if (item.name !== additional.item.name) {
          option_add.push({"id": item.id, "name": item.name, "price": item.price});
        } else {
          additional.value.push({"id": item.id, "name": item.name, "price": item.price});
        }
        this.count_additionals[item.name] = 0;
      });
    });
    this.counters_add = this.count_additionals;
  }

  cancelItem() {
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

    if(this.counters_var !== undefined) {

      let vares = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      if(vares < this.cantProduct) {
        this.counters_var[name] += 1;
        this.cantProductVariant = this.counters_var[name];
        let idElement = `count-variant-${idSelect}`;
        let element = document.getElementById(idElement);
        element.innerHTML=this.cantProductVariant.toString();
      }

      let vares_validation = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      if(vares_validation == this.cantProduct && this.counters_add === undefined){
        this.activeAgregate = false;
      } else {
        this.activeAgregate = true;
      }
    }

  }

  removeCantVariant(idSelect, name) {

    if(this.counters_var !== undefined) {
      let vares = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      if(vares >= 1){
        this.counters_var[name] -= 1;
        this.cantProductVariant = this.counters_var[name];
        let idElement = `count-variant-${idSelect}`;
        let element = document.getElementById(idElement);
        element.innerHTML=this.cantProductVariant.toString();
      }

      let vares_validation = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      if(vares_validation === this.cantProduct && this.counters_add === undefined){
        this.activeAgregate = false;
      } else {
        this.activeAgregate = true;
      }
    }
  }

  addCantAdd(item, idSelect, name) {
    if(this.counters_add !== undefined) {
      let addes = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      if(addes < (this.cantProduct * item.amount)){
        this.counters_add[name] += 1;
        this.cantProductAdd = this.counters_add[name];
        let idElement = `count-additional-${idSelect}`;
        let element = document.getElementById(idElement);
        element.innerHTML=this.cantProductAdd.toString();
      }

      let vares = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      let addes_validation = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      if(vares !== undefined) {
        if(addes_validation === item.amount && vares === this.cantProduct){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      } else {
        if(addes_validation === item.amount){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }
  }

  removeCantAdd(item, idSelect, name) {

    if(this.counters_add !== undefined) {
      let addes = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      if(addes >= 1){
        if(this.counters_add[name] >= 1){
          this.counters_add[name] -= 1;
          this.cantProductAdd = this.counters_add[name];
          let idElement = `count-additional-${idSelect}`;
          let element = document.getElementById(idElement);
          element.innerHTML=this.cantProductAdd.toString();
        }
      }

      let vares = Object.values(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      let addes_validation = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      if(addes_validation === item.amount && vares === this.cantProduct){
        this.activeAgregate = false;
      } else {
        this.activeAgregate = true;
      }
    }
  }

  addOrder() {
    // DESACTIVA BOTON AGREGAR
    this.activeAgregate = true;

    let pedido = {
      restaurant: this.restaurant.id,
      product: {
        id: this.product.id,
        name: this.product.name,
        count: this.cantProduct,
        comments: this.comments,
        variants: [],
        additionals: []
      }
    };

    let variant_key = Object.keys(this.counters_var);
    let addit_key = Object.keys(this.counters_add);

    let variantes = [];
    variant_key.forEach(key => {
      if(this.counters_var[key] !== 0){
        variantes.push({name: key, count: this.counters_var[key]});
      }
    });
    let adicionales = [];
    addit_key.forEach(key => {
      if(this.counters_add[key] !== 0){
        adicionales.push({name: key, count: this.counters_add[key]});
      }
    });

    variantes = variantes.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])
    adicionales = adicionales.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])

    let variant_order = [];
    variantes.forEach(el => {
      this.product.variants.forEach(vary => {
        if(vary.name == el.name){
          variant_order.push({id: vary.id, name: vary.name, price: vary.price, count: el.count});
        }
      });
      pedido.product.variants.push(variant_order);
    });

    let addit_order = [];
    adicionales.forEach(el => {
      this.product.additionals_products[0].additionals_items.forEach(addi => {
        if(addi.name == el.name){
          addit_order.push({id: addi.id, name: addi.name, price: addi.price, count: el.count});
        }
      });
      pedido.product.additionals.push(addit_order);
    });

    pedido.product.variants = pedido.product.variants.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])[0]
    pedido.product.additionals = pedido.product.additionals.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])[0]

    this.order.push(pedido);

    this.storage.addObject("list_order", this.order);

    this.toast.show("Orden agregada con éxito!", 2300);

    setTimeout(() => {
      this.navCtrl.back();
    }, 2700);
  }

}
