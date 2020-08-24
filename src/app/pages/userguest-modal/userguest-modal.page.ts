import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-userguest-modal',
  templateUrl: './userguest-modal.page.html',
  styleUrls: ['./userguest-modal.page.scss'],
})
export class UserguestModalPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

  login() {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/login']);
  }

  register() {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/register']);
  }

}
