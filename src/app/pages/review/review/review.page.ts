import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QualifyService } from '../../../services/qualify-review/qualify.service';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  disabledButton = true;

  rates:any;
  item:any;
  user:any;

  data = {
    review: "",
    rates: []
  };

  ratingsDB:any[] = [];

  categories = {
    "comida": 1,
    "ambiente": 2,
    "servicio": 3
  }

  constructor(
    private route: Router,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private storage: StorageService,
    private qualifyService: QualifyService
  ) {
    this.rates = this.route.getCurrentNavigation().extras.state.rates;
    this.item = this.route.getCurrentNavigation().extras.state.item;
    this.user = this.route.getCurrentNavigation().extras.state.user;
    this.data.rates = this.rates;
  }

  ngOnInit() {
    this.storage.getObject("ratings").then(res => {
      if(res){
        this.ratingsDB = res;
      }
    });
  }

  setReview(ev){
    this.data.review = ev.detail.value;
  }

  save(){

    let type = this.item.type === 'RESERVE'? 'reservation' : 'order';

    this.rates.forEach(rate => {
      let dataSend = {
        user: this.user,
        related_id: this.item.id,
        score: rate.value,
        score_category_id: this.categories[rate.item],
        restaurant: this.item.restaurant.id,
        related_type: type
      }
      this.qualifyService.saveQualify(dataSend).then(res => {
        //ok
        console.log("RES-QUALIFY", res);
        this.ratingsDB.push(dataSend);
        this.storage.addObject("ratings", this.ratingsDB);
      }).catch(err => {
        console.log("Error al intentar calificar", err);
      });
    });

    let data = {
      user: this.user,
      restaurant: this.item.restaurant.id,
      message: this.data.review
    };
    this.qualifyService.saveReview(data).then(res => {
      //ok
      console.log("RES-REVIEW", res);
      this.showAlert();
    }).catch(err => {
      console.log("Error al intentar enviar review", err);
    });
  }

  async showAlert(){
    const alert = await this.alertCtrl.create({
      header: `Calificación exitosa`,
      subHeader: "Muchas gracias, la calificación ha sido realizada con éxito.",
      buttons: [
          {
              text: 'Aceptar',
              handler: () => {
                  this.navCtrl.navigateRoot('/tabs/home');
                  //this.navCtrl.navigateRoot('/tabs/orders');
              }
          }
        ]
    });

    await alert.present();
  }

}
