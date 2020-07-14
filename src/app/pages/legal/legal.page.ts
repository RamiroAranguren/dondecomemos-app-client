import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/user.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';
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
    private navCtrl: NavController,
    private userService: UsersService,
    private storage: StorageService,
    private loader: LoaderService,
    public formBuild: FormBuilder,
    private toast: ToastService,
    private platform: Platform,
    private router: Router
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
