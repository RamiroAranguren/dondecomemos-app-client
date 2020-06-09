import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-password-email-step1',
  templateUrl: './recovery-password-email-step1.page.html',
  styleUrls: ['./recovery-password-email-step1.page.scss'],
})
export class RecoveryPasswordEmailStep1Page implements OnInit {

  type = 'password';

  form: FormGroup;

  errors = {
    email: []
  }

  userRegister = {
    email: ""
  }

  constructor(
    public formBuild: FormBuilder,
    public navCtrl: NavController,
  ) {
    this.form = this.formBuild.group({
        "email": ["", [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ], []]
    });
  }

  ngOnInit() {
  }

  doRegister() {

    if (this.form.valid) {
      let navigationExtras: NavigationExtras = {
        state: {data: this.userRegister}
      };
      this.navCtrl.navigateForward(['/recovery-password-code-step2'], navigationExtras);
    }

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

}