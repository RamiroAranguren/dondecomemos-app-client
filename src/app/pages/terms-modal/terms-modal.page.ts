import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.page.html',
  styleUrls: ['./terms-modal.page.scss'],
})
export class TermsModalPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
