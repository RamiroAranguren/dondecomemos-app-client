import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-terms-modal',
    templateUrl: './terms-modal.page.html',
    styleUrls: ['./terms-modal.page.scss'],
})
export class TermsModalPage implements OnInit {

    backButtonSuscription:any;
    constructor(
        public navCtrl: NavController,
        private platform: Platform,
        public modalCtrl: ModalController,
    ) {

    }

    ngOnInit() {
    }
    ionViewDidEnter() {
        this.backButtonSuscription = this.platform.backButton.subscribe(() => {
            this.modalCtrl.dismiss();
        });
    }

    ionViewWillLeave() {
        this.backButtonSuscription.unsubscribe();
    }
    dismiss() {
        this.modalCtrl.dismiss();
    }

}
