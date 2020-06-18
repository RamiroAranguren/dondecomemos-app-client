import { Component, OnInit } from '@angular/core';
import { restaurant } from '../../../interfaces/restaurant';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  restaurant:restaurant;

  isFav = false;

  slideOptions = {
    slidesPerView: 2,
    slidesOffsetBefore: -55,
    spaceBetween: 8,
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
    slidesOffsetBefore: -10,
    width: 365,
    // slidesOffsetAfter: -20,
    spaceBetween: 1
  }

  favorites: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private route: Router,
    private loader: LoaderService,
    private storage: StorageService,
    private favService: FavoritesService
  ) {}

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
        let id_restos = this.favorites.map(data => {
          return data.resto;
        });
        if(id_restos.includes(this.restaurant.id))
          this.isFav = true;
      }
    });
  }

  addFavorite(resto: restaurant) {
    this.loader.display("Agregando a favoritos...");
    this.favService.post(resto).then((res:any) => {
      this.loader.hide();
      if(!this.favorites.includes(resto.id))
        this.favorites.push({resto: resto.id, fav: res.id});
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
              let id_fav = this.favorites.map(data => {
                if(data.resto === id)
                  return data.fav;
              });
              this.favService.delete(id_fav[0]).then((res:any) => {
                let id_fav_resto = this.favorites.filter(fav => {
                  if(fav.resto !== id)
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

}
