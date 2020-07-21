import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { restaurant } from '../../../interfaces/restaurant';
import { IonContent, NavController } from '@ionic/angular';
import { CategoriesService } from '../../../services/products/categories.service';
import { StorageService } from '../../../services/storage/storage.service';
import { UserInterface } from 'src/app/interfaces/user';
import { UsersService } from '../../../services/users/user.service';

@Component({
  selector: 'app-pre-order',
  templateUrl: './pre-order.page.html',
  styleUrls: ['./pre-order.page.scss'],
})
export class PreOrderPage implements OnInit {

  @ViewChild('content', {static: false}) content: IonContent;

  user:UserInterface;
  restaurant:restaurant;
  type:string;
  data_order:any;
  product_categories:any[] = [];
  product_titles:any[] = [];
  menues:any[] = [];
  orders:any[] = [];

  price_total = 0;

  isFav = false;
  isGuest = true;

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private productCategoriesService: CategoriesService,
    private storage: StorageService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;
    this.type = this.route.getCurrentNavigation().extras.state.type;
    this.data_order = this.route.getCurrentNavigation().extras.state.data;
    this.user = this.userService.user;
  }

  ionViewDidEnter(){
    //SERVICE GET PRODUCTS-CATEGORIES
    this.productCategoriesService.get(this.restaurant.id).then((categories:any) => {
      this.product_categories = categories;
      this.product_titles = this.product_categories.map(category => category.name);
    });

    setTimeout(() => {
      this.storage.getObject("list_order").then(res => {
        if(res){
          this.orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id === this.user.id));
          let prices_order = [];
          this.orders.forEach(order => {

            if(order.product.variants !== undefined){
              if(order.product.variants.length > 0) {
                let prices_var = order.product.variants.map(vary => {
                  return vary.price * vary.count;
                });
                prices_order = prices_order.concat(prices_var);
              }
            }

            if(order.product.additionals !== undefined) {
              if(order.product.additionals.length > 0) {
                let prices_add = order.product.additionals.map(add => {
                  return add.price * add.count;
                });
                prices_order = prices_order.concat(prices_add);
              }
            }

            prices_order = prices_order.concat(order.product.price * order.product.count);
          });

          if(prices_order.length > 0){
            this.price_total = prices_order.reduce((prev, curr) => prev + curr);
          }
        }
      });
    }, 800);
  }

  scrollTo(elementId: string) {
    let y = document.getElementById(elementId);
    this.content.scrollToPoint(0, y.offsetTop-80, 1000);
  }

  addItemOrder(category_name:string, product) {
    let navigationExtras: NavigationExtras = {
      state: {
        type: this.type,
        category_name,
        product,
        restaurant: {id: this.restaurant.id},
      }
    };
    this.navCtrl.navigateForward(['/restaurant/add-item-order'], navigationExtras);
  }

  // bookTable() {
  //   let navigationExtras: NavigationExtras = {
  //     state: {restaurant: this.restaurant}};
  //   this.navCtrl.navigateForward(['/restaurant/book-table'], navigationExtras);
  // }

  viewOrders() {
    let navigationExtras: NavigationExtras = {
      state: {
        type: this.type,
        restaurant: this.restaurant,
        data: this.data_order
      }
    };
    this.navCtrl.navigateForward(['/restaurant/view-list-orders'], navigationExtras);
  }

}
