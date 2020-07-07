import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-rate',
    templateUrl: './rate.page.html',
    styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
    disabledButton: boolean = false;
    constructor(
        private navCtrl: NavController
    ) { }

    ngOnInit() {
    }

    goToReview() {
        this.navCtrl.navigateForward('/order/review');
    }

}
