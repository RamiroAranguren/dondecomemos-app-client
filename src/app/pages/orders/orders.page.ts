import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, IonSegment, IonSegmentButton, NavController } from '@ionic/angular';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;

    constructor(
        private navCtrl: NavController
    ) { }
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };
    reservation:boolean = true;
    invitado:boolean = false;
    ngOnInit() {

    }
    ionViewDidEnter(){
        this.slides.lockSwipes(true);
    }
    next() {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
    }
    back() {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
    }

    goToRate() {
        this.navCtrl.navigateForward('/order/rate');
    }

}
