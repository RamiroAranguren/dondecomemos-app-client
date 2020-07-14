import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';


@Component({
    selector: 'app-legal-modal',
    templateUrl: './legal-modal.page.html',
    styleUrls: ['./legal-modal.page.scss'],
})
export class LegalModalPage implements OnInit {

    backButtonSuscription: any;
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private platform: Platform,
    ) {

    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.backButtonSuscription = this.platform.backButton.subscribeWithPriority(1000,() => {
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
