import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserInterface } from 'src/app/interfaces/user';

@Component({
  selector: 'app-add-item-order',
  templateUrl: './add-item-order.page.html',
  styleUrls: ['./add-item-order.page.scss'],
})
export class AddItemOrderPage implements OnInit {

  type:string;
  category_name:string;
  product:any;
  restaurant:any;
  comments = "";

  user:UserInterface;

  variants:any[] = [];
  additionals:any[] = [];

  order:any[] = [];

  multiplos = [];

  count_variants = {};
  count_additionals = {};

  counters_add:any;
  counters_var:any;

  cantProduct:number = 1;
  cantProductVariant = 0;
  cantProductAdd = 0;
  cantAdditionals = 0;
  cantAdditionalsViews = "";
  counters:any;

  checkItem:any;

  activeAgregate = true;

  validar_cantidad = "";

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private toast: ToastService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.type = this.route.getCurrentNavigation().extras.state.type;
    this.category_name = this.route.getCurrentNavigation().extras.state.category_name;
    this.product = this.route.getCurrentNavigation().extras.state.product;
    this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;

    this.storage.getObject("list_order").then(res => {
      if(res)
        this.order = res;
    });

    this.storage.getObject("user").then((res:UserInterface) => {
      if(res)
        this.user = res;
    });
  }

  ionViewDidEnter() {

    console.log("PROD", this.product);

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
    if(variante.name !== ""){
      this.variants.push(variante);
    }

    // ADDITIONALS
    let additional = {
      item: {name: "", type: "", amount: 0},
      value: []
    };
    let option_add = [];
    this.product.additionals_products.forEach(addit => {
      console.log("ADD", addit);

      if(addit.type === 'Obligatoria' && addit.multiple === false) {
        // Obligatorio - Unico - No hace falta poner cantidad (en panel) =
        // La cantidad de adicioanles tiene que ser igula a la cantidad de productos en la pantalla.
        //this.cantAdditionals = this.cantProduct;
        this.validar_cantidad = "cant_pantalla";
      }

      if(addit.type === 'Opcional' && addit.multiple === false) {
        // Opcional - Unico - No hace falta poner cantidad (en panel) =
        // La cantidad de adicioanles tiene que ser menor o igual a la cantidad de productos en la pantalla.
        this.validar_cantidad = "menorIgual_pantalla";
      }

      if(addit.type === 'Obligatoria' && addit.multiple === true) {
        // Obligatorio - Multiple - Hace falta poner la cantidad en panel (CANTPANEL) =
        // La cantidad de adicionales tiene que ser igual CANTPANEL * la cantidad seleccionada
        // en la pantalla del prodcuto.
        this.validar_cantidad = "validar";
        this.cantAdditionals += addit.amount;
      }

      if(addit.type === 'Opcional' && addit.multiple === true) {
        // Opcional - Multiple - Hace falta poner la cantidad en panel (CANTPANEL) =
        // La cantidad de adiciones tiene que ser multiplo a CANTPANEL.
        // Puede ser 0. No tiene que superar CANTPANEL * cantidad de producto en la pantalla del producto.
        this.validar_cantidad = "multiplo";
        this.cantAdditionals += addit.amount;
        ////
        this.multiplos = [];
        for(var i=0; i<=this.cantProduct;i++){
          this.multiplos.push(i*this.cantAdditionals);
        }
        this.cantAdditionalsViews = `${this.multiplos.join("-")}`;
      }

      if(addit.type === 'Opcional' && addit.multiple === true && addit.amount === -1) {
        // Opcional - Multiple - No validar
        this.validar_cantidad = "noValidar";
        this.cantAdditionalsViews = "o no";
      }
      if(addit.type === 'Obligatoria' && addit.multiple === true && addit.amount === -1) {
        // Obligatorio - Multiple - al menos.
        this.validar_cantidad = "minimo_uno";
        this.cantAdditionalsViews = "mínimo 1";
      }

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

    if(this.product.variants.length === 0 && this.product.additionals_products.length === 0) {
      this.activeAgregate = false;
    }
    if(this.product.variants.length === 0 && this.product.additionals_products.length !== 0) {
      switch (this.validar_cantidad) {
        case "cant_pantalla":
          this.activeAgregate = true;
          this.cantAdditionalsViews = (this.cantProduct).toString();
          break;
        case "validar":
          this.activeAgregate = true;
          this.cantAdditionalsViews = (this.cantProduct * this.cantAdditionals).toString();
          break;
        case "minimo_uno":
          this.activeAgregate = true;
          break;
        default:
          this.activeAgregate = false;
      }
    }

    console.log("VALIDADOR", this.validar_cantidad);

  }

  cancelItem() {
    this.navCtrl.back();
  }

  addCantProduct() {
    this.cantProduct += 1;
    this.setTextAdditional();
    if(this.counters_add !== undefined){
      let addes_validate = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );
      this.validateBtn(addes_validate, this.checkItem);
    }
  }

  removeCantProduct() {
    if(this.cantProduct >= 2){
      this.cantProduct -= 1;
    }
    this.setTextAdditional();
    if(this.counters_add !== undefined){
      let addes_validate = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );
      this.validateBtn(addes_validate, this.checkItem);
    }
  }

  addCantVariant(idSelect, name) {

    if(this.counters_var !== undefined) {

      this.counters_var[name] += 1;
      this.cantProductVariant = this.counters_var[name];
      let idElement = `count-variant-${idSelect}`;
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductVariant.toString();

      let vares = Object.values<number>(this.counters_var).reduce(
        (previous:number, current:number) => { return previous + current }, 0);
      this.cantProduct = vares;

      this.setTextAdditional();
      if(this.counters_add !== undefined){
        let addes_validate = Object.values(this.counters_add).reduce(
          (previous:number, current:number) => previous + current );
        this.validateBtn(addes_validate, this.checkItem);
      }
    }
  }

  removeCantVariant(idSelect, name) {

    if(this.counters_var !== undefined) {
      let vares = Object.values<number>(this.counters_var).reduce(
        (previous:number, current:number) => previous + current );

      if(vares >= 1){
        this.counters_var[name] -= 1;
        this.cantProductVariant = this.counters_var[name];
        if(this.cantProductVariant < 0){
          this.cantProductVariant = 0;
          this.counters_var[name] = 0;
        }
        let idElement = `count-variant-${idSelect}`;
        let element = document.getElementById(idElement);
        element.innerHTML = this.cantProductVariant.toString();
      }

      let vares_valid = Object.values<number>(this.counters_var).reduce(
        (previous:number, current:number) => { return previous + current }, 0);
      this.cantProduct = vares_valid;

      this.setTextAdditional();

      if(this.counters_add !== undefined){
        let addes_validate = Object.values(this.counters_add).reduce(
          (previous:number, current:number) => previous + current );
        this.validateBtn(addes_validate, this.checkItem);
      }

    }
  }

  setTextAdditional(){
    if(this.validar_cantidad === 'cant_pantalla'){
      this.cantAdditionalsViews = this.cantProduct.toString();
    }

    if(this.validar_cantidad === 'menorIgual_pantalla'){
      this.cantAdditionalsViews = this.cantProduct.toString();
    }

    if(this.validar_cantidad === 'multiplo'){
      this.multiplos = [];
      for(var i=0; i<=this.cantProduct;i++){
        this.multiplos.push(i*this.cantAdditionals);
      }
      this.cantAdditionalsViews = `${this.multiplos.join("-")}`;
    }

    if(this.validar_cantidad === 'validar'){
      this.cantAdditionalsViews = (this.cantProduct * this.cantAdditionals).toString();
    }

    if(this.validar_cantidad === 'noValidar'){
      this.cantAdditionalsViews = "o no";
    }

    if(this.validar_cantidad === 'minimo_uno'){
      this.cantAdditionalsViews = "mínimo 1";
    }
  }

  addCantAdd(item, idSelect, name) {
    this.checkItem = item;
    if(this.counters_add !== undefined) {
      this.counters_add[name] += 1;
      this.cantProductAdd = this.counters_add[name];
      let idElement = `count-additional-${idSelect}`;
      let element = document.getElementById(idElement);
      element.innerHTML=this.cantProductAdd.toString();
    }

    let addes = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

    this.validateBtn(addes, item);

  }

  removeCantAdd(item, idSelect, name) {
    this.checkItem = item;
    if(this.counters_add !== undefined) {
      let addes = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      if(addes >= 1){
        if(this.counters_add[name] >= 1){
          this.counters_add[name] -= 1;
          this.cantProductAdd = this.counters_add[name];
          if(this.cantProductAdd < 0){
            this.cantProductAdd = 0;
            this.counters_add[name] = 0;
          }
          let idElement = `count-additional-${idSelect}`;
          let element = document.getElementById(idElement);
          element.innerHTML=this.cantProductAdd.toString();
        }
      }

      let addes_validate = Object.values(this.counters_add).reduce(
        (previous:number, current:number) => previous + current );

      this.validateBtn(addes_validate, item);
    }
  }

  validateBtn(cant, item){
    if(this.validar_cantidad === 'cant_pantalla'){
      console.log("Obligatorio - Unico - No hace falta poner cantidad (en panel) = La cantidad de adicioanles tiene que ser igula a la cantidad de productos en la pantalla.");
      if(this.variants.length === 0){
        // NO HAY VARIANTES ENTONCES ME RIJO X CANT PRODUCTO
        if(cant === this.cantProduct){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
      if(this.variants.length > 0 && this.counters_var !== undefined){
        // HAY VARIANTES ENTONCES ME RIJO X CANT VARIANTES
        let vares = Object.values<number>(this.counters_var).reduce(
          (previous:number, current:number) => {
            return previous + current
          }, 0);
        if(cant === vares){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }

    if(this.validar_cantidad === 'menorIgual_pantalla'){
      console.log("Opcional - Unico - No hace falta poner cantidad (en panel) = La cantidad de adicioanles tiene que ser menor o igual a la cantidad de productos en la pantalla.");
      if(this.variants.length === 0){
        // NO HAY VARIANTES ENTONCES ME RIJO X CANT PRODUCTO
        if(cant <= this.cantProduct){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
      if(this.variants.length > 0 && this.counters_var !== undefined){
        // HAY VARIANTES ENTONCES ME RIJO X CANT VARIANTES
        let vares = Object.values<number>(this.counters_var).reduce(
          (previous:number, current:number) => {
            return previous + current
          }, 0);
        if(cant <= vares){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }

    if(this.validar_cantidad === 'validar'){
      console.log("Obligatorio - Multiple - Hace falta poner la cantidad en panel (CANTPANEL) = La cantidad de adicionales tiene que ser igual CANTPANEL * la cantidad seleccionada en la pantalla del prodcuto.");
      if(this.variants.length === 0){
        // NO HAY VARIANTES ENTONCES ME RIJO X CANT PRODUCTO
        if(cant === (this.cantProduct * item.amount)){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
      if(this.variants.length > 0 && this.counters_var !== undefined){
        // HAY VARIANTES ENTONCES ME RIJO X CANT VARIANTES
        let vares = Object.values<number>(this.counters_var).reduce(
          (previous:number, current:number) => {
            return previous + current
          }, 0);
        if(cant === (vares * item.amount)){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }

    if(this.validar_cantidad === 'multiplo'){
      console.log("Opcional - Multiple - Hace falta poner la cantidad en panel (CANTPANEL) = La cantidad de adiciones tiene que ser multiplo a CANTPANEL. Puede ser 0. No tiene que superar CANTPANEL * cantidad de producto en la pantalla del producto.", this.multiplos);
      if(this.multiplos.includes(cant) && this.variants.length === 0){
        this.activeAgregate = false;
      } else {
        this.activeAgregate = true;
      }
      if(this.multiplos.includes(cant) && this.variants.length !== 0){
        let vares = Object.values<number>(this.counters_var).reduce(
          (previous:number, current:number) => {
            return previous + current
          }, 0);
        if(vares >=1){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }

    if(this.validar_cantidad === 'noValidar'){
      console.log("Opcional - Multiple - CANTPANEL:-1 = No hacer validaciones.");
      this.activeAgregate = false;
    }

    if(this.validar_cantidad === 'minimo_uno'){
      console.log("Obligatorio - Multiple - CANTPANEL:-1 = Al menos uno elegido.", cant, this.variants.length);
      if(cant >= 1 && this.variants.length === 0){
        this.activeAgregate = false;
      } else {
        this.activeAgregate = true;
      }
      if(cant >= 1 && this.variants.length !== 0){
        let vares = Object.values<number>(this.counters_var).reduce(
          (previous:number, current:number) => {
            return previous + current
          }, 0);
        if(vares >=1){
          this.activeAgregate = false;
        } else {
          this.activeAgregate = true;
        }
      }
    }
  }

  addOrder() {
    // DESACTIVA BOTON AGREGAR
    // this.activeAgregate = true;

    let pedido = {
      type: this.type,
      user: this.user,
      restaurant: this.restaurant.id,
      product: {
        id: this.product.id,
        name: this.product.name,
        price: this.product.real_price,
        count: this.cantProduct,
        comments: this.comments,
        variants: [],
        additionals: []
      },
      menu: null
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

    this.toast.show("Orden agregada con éxito!", 1200);

    setTimeout(() => {
      this.navCtrl.back();
    }, 1200);
  }

}
