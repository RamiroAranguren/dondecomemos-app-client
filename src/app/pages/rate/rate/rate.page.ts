import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    selector: 'app-rate',
    templateUrl: './rate.page.html',
    styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
    disabledButton: boolean = true;

    item:any;
    user:any;

    rate = {
        comida: 0,
        ambiente: 0,
        servicio: 0,
    }

    constructor(
        private route: Router,
        private navCtrl: NavController,
    ) {
        this.item = this.route.getCurrentNavigation().extras.state.item;
        this.user = this.route.getCurrentNavigation().extras.state.user;
    }

    ngOnInit() {
    }

    rateComida(value) {
        console.log("Commida", value);
        this.rate.comida = value;
        if(this.rate.ambiente !== 0 && this.rate.servicio !== 0){
            this.disabledButton = false;
        }

    }

    rateAmbiente(value) {
        console.log("Ambiente", value);
        this.rate.ambiente = value;
        if(this.rate.comida !== 0 && this.rate.servicio !== 0){
            this.disabledButton = false;
        }
    }

    rateServicio(value) {
        console.log("Servicio", value);
        this.rate.servicio = value;
        if(this.rate.ambiente !== 0 && this.rate.comida !== 0){
            this.disabledButton = false;
        }
    }

    goToReview() {
        let rates = [];
        if(this.rate.comida !== 0){
            rates.push({item: "comida", value: this.rate.comida});
        }
        if(this.rate.ambiente !== 0){
            rates.push({item: "ambiente", value: this.rate.ambiente});
        }
        if(this.rate.servicio !== 0){
            rates.push({item: "servicio", value: this.rate.servicio});
        }
        let params: NavigationExtras = {state: {rates: rates, item: this.item, user:this.user}};
        this.navCtrl.navigateForward(['/order/review'], params);
    }

}
