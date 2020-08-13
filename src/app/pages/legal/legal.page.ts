import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { TermsModalPage } from '../terms-modal/terms-modal.page';
import { LegalModalPage } from '../legal-modal/legal-modal.page';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage implements OnInit {

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public formBuild: FormBuilder
  ) { }

  ngOnInit() {
  }
  
  async policyModal() {
    let modal = await this.modalCtrl.create({
      component: TermsModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }

  async legalModal() {
    let modal = await this.modalCtrl.create({
      component: LegalModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }
}
