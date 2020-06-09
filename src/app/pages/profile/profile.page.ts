import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { UsersService } from '../../services/users/user.service';
import { LegalModalPage } from '../legal-modal/legal-modal.page';
import { UserInterface } from '../../interfaces/user';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  initals = "N/A";
  user:any = {
    id:"",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    token: "",
    guest: false
  };

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private userService: UsersService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.storage.getObject("user").then((user:UserInterface) => {
      this.user = user;
      this.initals = `${this.user.first_name.slice(0, 1)}${this.user.last_name.slice(0, 1)}`;
    }).catch(err => {
      console.log(err);
      this.user = {
        id:"",
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        token: "",
        guest: true
      };
    });
  }

  async logOut() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Seguro quiere cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Cerrar sesión',
          handler: () => {
            this.userService.logout();
            this.navCtrl.navigateRoot('/step-functions');
          }
        }
      ]
    });

    await alert.present();
  }

  async legal(){
    let modal = await this.modalCtrl.create({
      component: LegalModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }

}
