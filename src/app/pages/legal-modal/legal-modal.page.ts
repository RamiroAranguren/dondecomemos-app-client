import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-legal-modal',
  templateUrl: './legal-modal.page.html',
  styleUrls: ['./legal-modal.page.scss'],
})
export class LegalModalPage implements OnInit {

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
