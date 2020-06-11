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

  initTab = true;
  guestStatus = false;
  menuHide = false;
  profile = false;
  legal = false;

  initals = "";

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
        "phone": ["", [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('\d{1}[a-zA-Z]{2}\d{6}')
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

  legalView(){
    this.initTab = false;
    this.menuHide = false;
    this.guestStatus = false;
    this.profile = false;
    this.legal = true;
  }

  async legalModal(){
    let modal = await this.modalCtrl.create({
      component: LegalModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }

  dataView() {
    this.initTab = false;
    this.menuHide = false;
    this.guestStatus = false;
    this.profile = true;
    this.legal = false;
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
    console.log('cklik close');
    this.initTab = false;
    this.menuHide = true;
    this.guestStatus = false;
    this.profile = false;
    this.legal = false;
  }

  closeProfile() {
    console.log('cklik close');
    this.initTab = false;
    this.menuHide = true;
    this.guestStatus = false;
    this.profile = false;
    this.legal = false;
  }

  closeLegal() {
    this.initTab = false;
    this.menuHide = true;
    this.guestStatus = false;
    this.profile = false;
    this.legal = false;
  }

  changePassword() {
    console.log('change passw');
  }

  ///

  checkEmail() {
    this.errors.email = [];
    if (this.field('email').invalid){
      this.addError("email", "Error: Email inválido.");
    } else {
      this.errors.email = [];
    }
  }

  checkPhone() {
    this.errors.phone = [];
    let phone_number = this.field('phone').value.toString();

    if (this.field('phone').invalid){
      this.addError("phone", "Error: número muy corto.");
    } else {
      this.errors.phone = [];
    }

    
    // if(phone_number){
    //   if(phone_number.length < 8){
    //     this.addError("phone", "Error: número muy corto.");
    //   } else {
    //     this.errors.phone = [];
    //   }
    // } else {
    //   this.errors.phone = [];
    // }
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

}
