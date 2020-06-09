import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  type = 'password';

  form: FormGroup;

  errors = {
    email: [],
    password: [],
    firstName: [],
    lastName: []
  }

  userRegister = {
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  }

  constructor(
    public formBuild: FormBuilder,
    public navCtrl: NavController,
    private alertCtrl: AlertController
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
  }

  doRegister() {

    if (this.form.valid) {
      let navigationExtras: NavigationExtras = {
        state: {data: this.userRegister}
      };
      this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    }

  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Cuenta ya existente',
      message: 'El email ya se encuentra asociado a una',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Iniciar sesión',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }

  checkPassword() {
    this.errors.password = [];
    if (this.field('password').invalid)
      this.addError("password", "Error: La contraseña tiene menos de 6 carateres.");
  }

  checkEmail() {
    this.errors.email = [];
    if (this.field('email').invalid)
      this.addError("email", "Error: Email inválido.");
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

  showPassword() {
    this.type = this.type == 'password' ? 'text' : 'password'
  }

  showPrivacyModal() {
    // let modal = this.modal.create(PrivacyPolicyPage, {show: true});
    // modal.present();
  }

  showTermsModal() {
    // let modal = this.modal.create(TermsOfServicePage, {show: true});
    // modal.present();
  }

}
