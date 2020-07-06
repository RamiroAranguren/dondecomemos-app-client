import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, IonSegment, IonSegmentButton } from '@ionic/angular';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;

    constructor() { }
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };
    reservation:boolean = true;
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

}
