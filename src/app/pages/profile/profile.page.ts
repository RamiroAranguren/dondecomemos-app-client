import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { UsersService } from '../../services/users/user.service';
import { LegalModalPage } from '../legal-modal/legal-modal.page';
import { UserInterface } from '../../interfaces/user';
import { StorageService } from '../../services/storage/storage.service';
import { TermsModalPage } from '../terms-modal/terms-modal.page';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  guestStatus = true;
  menuHide = false;
  profile = false;
  legal = false;

  initals = "";

  form: FormGroup;

  errors = {
    email: [],
    phone: [],
    firstName: [],
    lastName: []
  }

  user: any = {
    id: "",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    token: "",
    guest: false,
    phone: null
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
    private loader: LoaderService,
    public formBuild: FormBuilder,
    private toast: ToastService
  ) {
    this.form = this.formBuild.group({
      "first_name": ["", [Validators.required], []],
      "last_name": ["", [Validators.required], []],
      "email": ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ], []],
      "phone": ["", [
        Validators.required
      ], []],
    });
  }

  ngOnInit() {
    this.storage.getObject("user").then((user: UserInterface) => {
      this.user = user;
      this.initals = `${this.user.first_name.slice(0, 1)}${this.user.last_name.slice(0, 1)}`;
    }).catch(err => {
      console.log(err);
      this.user = {
        id: "",
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        token: "",
        guest: true,
        phone: null
      };
    });
  }

  ionViewDidEnter() {
    let isGuest = this.userService.isGuestUser();
    if (isGuest) {
      this.guestStatus = true;
    } else {
      this.guestStatus = false;
      this.menuHide = true;
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

  legalView() {
    this.menuHide = false;
    this.guestStatus = false;
    this.profile = false;
    this.legal = true;
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

  dataView() {
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
  saveProfile() {

    this.errors.email = [];
    if (this.field('email').invalid) {
      this.addError("email", "Error: Email inválido.");
    } else {
      this.menuHide = false;
      this.guestStatus = false;
      this.legal = false;

      this.loader.display("Guardando cambios...")
      this.userService.saveChanges(this.user.first_name, this.user.last_name, this.user.email, this.user.phone)
        .then(() => {
          this.loader.hide();
          this.toast.show("Datos modificados con éxito", 2500);
          this.storage.addObject("user", this.userService.user);
        })
        .catch(errors => {
          console.log(errors);
          this.toast.show("Ocurrió un error al intentar modificar", 2500);
          this.loader.hide()
        });
    }
  }

  closeProfile() {
    let changes = this.changeForm();

    if (!changes) {
      this.menuHide = true;
      this.guestStatus = false;
      this.profile = false;
      this.legal = false;
    }

  }

  closeLegal() {
    this.menuHide = true;
    this.guestStatus = false;
    this.profile = false;
    this.legal = false;
  }

  changePassword() {
    let navigationExtras: NavigationExtras = { state: { data: this.user } };
    this.navCtrl.navigateForward(['/change-old-password'], navigationExtras);
  }

  changeForm() {
    let result = false;
    if (this.user.first_name !== this.userService.user.first_name ||
      this.user.last_name !== this.userService.user.last_name ||
      this.user.email !== this.userService.user.email ||
      this.user.phone !== this.userService.user.phone) {
      this.showAlert();
      result = true;
    } else {
      result = false;
    }

    console.log("RES", result);
    return result;
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: '¿Descartar cambios?',
      buttons: [
        {
          text: 'Descartar',
          handler: data => {
            this.menuHide = true;
            this.guestStatus = false;
            this.profile = false;
            this.legal = false;
            return;
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            return;
          }
        }
      ]
    });

    await alert.present();
  }


  ///

  checkEmail() {
    this.errors.email = [];
    if (this.field('email').invalid) {
      this.addError("email", "Error: Email inválido.");
    } else {
      this.errors.email = [];
    }
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

  ionViewWillLeave() {
    this.guestStatus = true;
    this.menuHide = false;
    this.profile = false;
    this.legal = false;
  }

}
