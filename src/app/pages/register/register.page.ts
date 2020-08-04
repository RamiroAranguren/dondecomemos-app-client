import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';

import { LegalModalPage } from '../legal-modal/legal-modal.page';
import { TermsModalPage } from '../terms-modal/terms-modal.page';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  type = 'password';
  timeMailCheck;
  timePassCheck
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
    last_name: "",
    net: null
  }

  constructor(
    public formBuild: FormBuilder,
    private modalCtrl: ModalController,
    public navCtrl: NavController
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
        state: { data: this.userRegister }};
      this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    }
  }

  checkPassword(){
    this.errors.password = [];
    clearTimeout(this.timePassCheck);
    this.timePassCheck = setTimeout(() => {
      this.errors.password = [];
      if (this.field('password').invalid)
        this.addError("password", "Error: La contraseña tiene menos de 6 carateres.");
    }, 2000);
  }

  checkEmail() {
    this.errors.email = [];
    clearTimeout(this.timeMailCheck);
    this.timeMailCheck = setTimeout(() => {
      this.errors.email = [];
      if (this.field('email').invalid)
        this.addError("email", "Error: Email inválido.");
    }, 2000);
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

  async showPrivacyModal() {
    let modal = await this.modalCtrl.create({
      component: TermsModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }

  async showTermsModal() {
    let modal = await this.modalCtrl.create({
      component: LegalModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();
  }

}
