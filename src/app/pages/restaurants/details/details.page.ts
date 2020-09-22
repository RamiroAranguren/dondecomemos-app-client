import { Component, OnInit, ViewChild } from '@angular/core';
import { restaurant } from '../../../interfaces/restaurant';
import { Router, NavigationExtras } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { AlertController, ModalController, IonContent, NavController, Platform } from '@ionic/angular';
import { UsersService } from '../../../services/users/user.service';
import { UserInterface } from 'src/app/interfaces/user';
import { ModalGaleryPage } from '../../modal-galery/modal-galery.page';
import { PicturesService } from '../../../services/pictures/pictures.service';
import { CategoriesService } from '../../../services/products/categories.service';
import { MenusService } from '../../../services/menus/menus.service';
import { ToastService } from '../../../services/toast/toast.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { BackButtonServiceService } from 'src/app/services/back-button/back-button-service.service';
import { UserguestModalPage } from '../../userguest-modal/userguest-modal.page';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  @ViewChild('content', {static: false}) content: IonContent;

  restaurant:restaurant;
  pictures:any[] = [];
  product_categories:any[] = [];
  product_titles:any[] = [];
  menues:any[] = [];
  orders:any[] = [];

  page_call = "home";

  price_total = 0;

  isFav = false;
  isGuest = true;

  slideOptions = {
    slidesPerView: 2,
    coverflowEffect: {
      rotate: 50,
      stretch: 30,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  slideOptionsMenu = {
    slidesPerView: 1.158,
    spaceBetween: 10
  }

  favorites: any[] = [];
  user:UserInterface;

  backButtonSuscription:any;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private toast: ToastService,
    private route: Router,
    private loader: LoaderService,
    private storage: StorageService,
    private favService: FavoritesService,
    private userService: UsersService,
    private picsService: PicturesService,
    private productCategoriesService: CategoriesService,
    private menuService: MenusService,
    private nativePageTransitions: NativePageTransitions,
    private backButtonServiceService: BackButtonServiceService,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
    this.page_call = this.route.getCurrentNavigation().extras.state.call;

    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
        let id_restos = this.favorites.map(data => {
          return data.restaurant.id;
        });
        if(id_restos.includes(this.restaurant.id)){
          this.isFav = true;
        }
      }
    });
    this.isGuest = this.userService.isGuestUser();
    this.user = this.userService.user;
  }

  // ionViewDidLeave() {
  //   console.log("ionViewDidLeave");
  // }

  // ionViewDidLoad(){
  //   console.log("ionViewDidLoad");
  // }

  ionViewWillEnter() {
    console.log("ionViewWillEnter", this.user, this.user.guest);
    this.picsService.get(this.restaurant.id).then((pics:any) => {
      this.pictures = pics;
    });

    //SERVICE GET PRODUCTS-CATEGORIES
    this.productCategoriesService.get(this.restaurant.id).then((categories:any) => {
      this.product_categories = categories;
      this.product_titles = this.product_categories.map(category => category.name);
    });

    //SERVICE GET MENÚS
    this.menuService.get(this.restaurant.id).then((menues:any) => {
      this.menues = menues;
    });
  }

  // ionViewWillUnload(){
  //   console.log("ionViewWillUnload");
  // }

  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }

  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

  ionViewDidEnter(){
    // this.backButtonServiceService.changeStatusToMinimize.emit(false);
    this.backButtonSuscription = this.platform.backButton.subscribe(()=>{
      if(this.price_total !== 0){
        this.showAlertBack();
      } else {
        this.toBack();
      }
    })

    setTimeout(() => {
      this.calculatePrice();
    }, 500);
  }

  ionViewWillLeave() {
    this.backButtonSuscription.unsubscribe();
  }

  calculatePrice(){
    this.storage.getObject("list_order").then(res => {
      if(res){
        this.orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id === this.user.id));
        let prices_order = [];
        this.orders.forEach(order => {

          if(order.product !== null){
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
          }

          if(order.menu !== null){
            prices_order = prices_order.concat(order.menu.real_price * 1)
          }

        });

        if(prices_order.length > 0){
          this.price_total = prices_order.reduce((prev, curr) => prev + curr);
        }
      }
    });
  }

  scrollTo(elementId: string) {
    let y = document.getElementById(elementId);
    this.content.scrollToPoint(0, y.offsetTop-80, 1000);
  }

  toBack(){
    this.backButtonServiceService.changeStatusToMinimize.emit(true);
    this.navCtrl.navigateRoot([`/tabs/${this.page_call}`]);
  }

  async showAlertBack() {
    const alert = await this.alertCtrl.create({
      header: 'Si sale perderá el pedido',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            return;
          }
        },
        {
          text: 'Salir',
          handler: () => {
            this.storage.getObject("list_order").then(res => {
              this.orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id !== this.user.id));
              this.storage.addObject("list_order", this.orders);
            });
            setTimeout(() => {
              this.backButtonServiceService.changeStatusToMinimize.emit(true);
              this.navCtrl.navigateRoot([`/tabs/${this.page_call}`]);
            }, 800);
          }
        }
      ]
    });

    await alert.present();
  }

  addFavorite(resto: restaurant) {
    this.loader.display("Agregando a favoritos...");
    this.favService.post(resto.id).then((res:any) => {
      this.loader.hide();
      this.isFav = true;
      this.toast.show("Agregado a Favoritos");
    }).catch (err => {
      this.loader.hide();
      console.log('err save DB favorites', err);
    });
    // ACTAULIZO LOCAL-STORE CON FAVORITOS
    this.favService.get(this.user.id).then((res:any) => {
      this.storage.addObject("favorites", res);
    });
  }

  removeFav(id:number) {
    // this.showAlert(id_restorant); // Pidieron que se saque
    this.storage.getObject("favorites").then((res_local:any) => {
      let id_fav = res_local.filter(data => data.restaurant.id === id);
      this.favService.delete(id_fav[0].id).then((response:any) => {
        let id_fav_resto = res_local.filter(fav => fav.restaurant.id !== id);
        this.storage.addObject("favorites", id_fav_resto);
        this.isFav = false;
        this.toast.show("Eliminado de Favoritos");
      });
    }).catch(err => {
      console.log('err', err);
    })
  }

  async showModalGalery(index) {
    let modal = await this.modalCtrl.create({
      component: ModalGaleryPage,
      cssClass: 'custom-galery-modal-css',
      componentProps: {
        pictures: this.pictures,
        index
      }
    });

    await modal.present();
  }

  info(restaurant:restaurant) {
    let navigationExtras: NavigationExtras = { state: { data: restaurant } };
    this.navCtrl.navigateForward(['/restaurant/info'], navigationExtras);
  }

  review(restaurant:restaurant) {
    //this.transitionAnimation();
    let navigationExtras: NavigationExtras = { state: { data: restaurant }};
    this.navCtrl.navigateForward(['/restaurant/qualify-review'], navigationExtras);
  }

  transitionAnimation(directionTransition = 'right'){
    let options: NativeTransitionOptions = {
      direction: directionTransition,
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
     }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => console.log('exito'))
      .catch(onError => console.log(onError,'error'));
  }

  addItemOrder(type:string, category_name:string, product) {
    // VALIDAR SI ES  UN USER GUEST
    if(this.user.guest){
      this.showModalUserGuest();
      return;
    }
    // SI NO ES USER GUEST ->
    let navigationExtras: NavigationExtras = {
      state: {
        type,
        category_name,
        product,
        restaurant: {id: this.restaurant.id},
      }
    };
    //his.transitionAnimation('left')
    this.navCtrl.navigateForward(['/restaurant/add-item-order'], navigationExtras);
  }

  bookTable() {
    // VALIDAR SI ES UN USER GUEST
    if(this.user.guest){
      this.showModalUserGuest();
      return;
    }
    // SI NO ESA USER GUEST ->
    let navigationExtras: NavigationExtras = {
      state: {user: this.user, restaurant: this.restaurant,
        product_categories: this.product_categories}};
    this.navCtrl.navigateForward(['/restaurant/book-table'], navigationExtras);
  }

  async showModalUserGuest() {
    let modal = await this.modalCtrl.create({
      component: UserguestModalPage,
      cssClass: 'custom-userguest-modal-css'
    });

    await modal.present();
  }

  viewOrders() {
    let navigationExtras: NavigationExtras = {
      state: {user: this.user, restaurant: this.restaurant}};
    this.navCtrl.navigateForward(['/restaurant/view-list-orders'], navigationExtras);
  }

  addMenu(menu){
    // VALIDAR SI ES UN USER GUEST
    if(this.user.guest){
      this.showModalUserGuest();
      return;
    }
    // SI NO ES USER GUEST ->
    let pedido = {
      type: "ORDER",
      user: this.user,
      restaurant: this.restaurant.id,
      product: null,
      menu: null
    };

    pedido.menu = menu;

    this.loader.display("Agregando el menú a la orden...");
    setTimeout(() => {
      this.orders.push(pedido);
      this.storage.addObject('list_order', this.orders);
      this.loader.hide();
    }, 1200);
    setTimeout(() => {
      this.calculatePrice();
    }, 1500);
  }

}
