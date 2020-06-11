import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

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

  guestStatus = false;
  menuHide = false;
  profile = false;

  form: FormGroup;

  profileData = {
    phone: "",
    email: "",
    first_name: "",
    last_name: "",
  }

  errors = {
    email: [],
    phone: [],
    firstName: [],
    lastName: []
  }

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

  options = {
    option1: false,
    option2: true
  }

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private userService: UsersService,
    private storage: StorageService,
    public formBuild: FormBuilder,
    // private loader: LoaderService,
  ) {
    this.form = this.formBuild.group({
        "first_name": ["", [Validators.required], []],
        "last_name": ["", [Validators.required], []],
        "email": ["", [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ], []],
        "password": ["", [
          Validators.required, Validators.minLength(6)
        ], []],
    });
  }

  ngOnInit() {
    let isGuest = this.userService.isGuestUser();
    if(isGuest){
      this.guestStatus = true;
    } else {
      this.guestStatus = false;
      this.menuHide = true;
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

  data() {
    this.menuHide = false;
    this.guestStatus = false;
    this.profile = true;
  }

  login() {
    this.navCtrl.navigateRoot('/login');
  }

  register() {
    this.navCtrl.navigateRoot('/register');
  }

  loginGoogle() {
    console.log('fcbk');
  }

  loginFcbk() {
    console.log('g+');
  }

  // FUNCTIONS PROFILE DATA
  saveProfile(){
    // this.menuHide = false;
    // this.guestStatus = false;
    // this.profile = true;
  }

}
