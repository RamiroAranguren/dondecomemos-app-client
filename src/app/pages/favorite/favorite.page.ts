import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/user.service';
import { NavController, AlertController } from '@ionic/angular';
import { restaurant } from 'src/app/interfaces/restaurant';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { LoaderService } from '../../services/loader/loader.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  menuHide = true;

  resto_favs: any[] = [];
  favorites: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: StorageService,
    private userService: UsersService,
    private favService: FavoritesService,
    private loader: LoaderService,
    private toastCtrl: ToastService
  ) { }

  ngOnInit() {
    let isGuest = this.userService.isGuestUser();
    if(isGuest){
      this.menuHide = false;
    }
    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
      }
    });
  }

  ionViewDidEnter() {
    this.loader.display("Cargando favoritos...");
    setTimeout(() => {
      this.favService.get().then((res:any) => {
        this.loader.hide();
        this.resto_favs = res;
      }).catch(err => {
        this.loader.hide();
        console.log('err-get-favs', err);
      });
    }, 1000);
  }

  removeFav(fav_id:number) {
    this.showAlert(fav_id);
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
              this.favService.delete(id).then((res:any) => {
                let id_fav_resto = this.favorites.filter(fav => fav.fav !== id);
                this.storage.addObject("favorites", id_fav_resto);
                this.resto_favs = this.resto_favs.filter(fav_resto => fav_resto.id !== id);
                this.toastCtrl.show("Eliminado de Favoritos");
              });
            }).catch(err => {
              console.log('err', err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  login() {
    this.navCtrl.navigateRoot('/login');
  }

  register() {
    this.navCtrl.navigateRoot('/register');
  }

  loginGoogle() {
    console.log('g+');
  // this.google.login({})
  //     .then(res => console.log(res))
  //     .catch(err => console.error(err));
  }

  loginFcbk() {
    console.log('fcbk');
  }

}
