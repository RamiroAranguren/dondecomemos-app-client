import { Component, OnInit, ViewChild } from '@angular/core';
import { restaurant } from '../../../interfaces/restaurant';
import { Router, NavigationExtras } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { AlertController, ModalController, IonContent, NavController } from '@ionic/angular';
import { UsersService } from '../../../services/users/user.service';
import { UserInterface } from 'src/app/interfaces/user';
import { ModalGaleryPage } from '../../modal-galery/modal-galery.page';
import { PicturesService } from '../../../services/pictures/pictures.service';
import { CategoriesService } from '../../../services/products/categories.service';
import { MenusService } from '../../../services/menus/menus.service';

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
    slidesPerView: 1,
    spaceBetween: 10
  }

  favorites: any[] = [];
  user:UserInterface;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: Router,
    private loader: LoaderService,
    private storage: StorageService,
    private favService: FavoritesService,
    private userService: UsersService,
    private picsService: PicturesService,
    private productCategoriesService: CategoriesService,
    private menuService: MenusService
  ) {}

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
        let id_restos = this.favorites.map(data => {
          return data.restaurant.id;
        });
        if(id_restos.includes(this.restaurant.id))
          this.isFav = true;
      }
    });
    this.isGuest = this.userService.isGuestUser();
    this.user = this.userService.user;
  }

  ionViewDidEnter(){
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

            prices_order = prices_order.concat(order.product.price);
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
              this.navCtrl.navigateRoot('/tabs/home');
            }, 800);
          }
        }
      ]
    });

    await alert.present();
  }

  addFavorite(resto: restaurant) {
    this.loader.display("Agregando a favoritos...");
    this.favService.post(resto).then((res:any) => {
      this.loader.hide();
      if(!this.favorites.includes(resto.id))
        this.favorites.push({id: res.id, client: this.user.id,  restaurant: {id: resto.id}});
        this.storage.addObject("favorites", this.favorites);
      this.isFav = true;
    }).catch (err => {
      this.loader.hide();
      console.log('err save DB favorites', err);
    });
  }

  removeFav(id_restorant:number) {
    this.showAlert(id_restorant);
  }

  async showAlert(id:number) {

    let alert = await this.alertCtrl.create({
      header: 'Eliminar de favoritos',
      message:"¿Seguro quiere eliminar al restaurante de Favoritos?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.storage.getObject("favorites").then(res => {
              let id_fav = this.favorites.filter(data => data.restaurant.id === id);
              this.favService.delete(id_fav[0].id).then((res:any) => {
                let id_fav_resto = this.favorites.filter(fav => {
                  if(fav.restaurant.id !== id)
                    return fav;
                });
                this.storage.addObject("favorites", id_fav_resto);
                this.isFav = false;
              });
            }).catch(err => {
              console.log('err', err);
            })
          }
        }
      ]
    });

    await alert.present();
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
    let navigationExtras: NavigationExtras = { state: { data: restaurant } };
    this.navCtrl.navigateForward(['/restaurant/qualify-review'], navigationExtras);
  }

  addItemOrder(category_name:string, product) {
    let navigationExtras: NavigationExtras = {
      state: {
        category_name,
        product,
        restaurant: {id: this.restaurant.id},
      }
    };
    this.navCtrl.navigateForward(['/restaurant/add-item-order'], navigationExtras);
  }

  bookTable() {
    let navigationExtras: NavigationExtras = {
      state: {restaurant: this.restaurant}};
    this.navCtrl.navigateForward(['/restaurant/book-table'], navigationExtras);
  }

  viewOrders() {
    let navigationExtras: NavigationExtras = {
      state: {restaurant: this.restaurant}};
    this.navCtrl.navigateForward(['/restaurant/view-list-orders'], navigationExtras);
  }

}
