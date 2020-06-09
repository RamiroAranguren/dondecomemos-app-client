import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recovery-password-code-step2',
  templateUrl: './recovery-password-code-step2.page.html',
  styleUrls: ['./recovery-password-code-step2.page.scss'],
})
export class RecoveryPasswordCodeStep2Page implements OnInit {

  form: FormGroup;

  errors = {
    code: []
  }

  userRegister = {
    code: ""
  }

  constructor(
    public formBuild: FormBuilder,
    public navCtrl: NavController,
  ) {
    this.form = this.formBuild.group({
        "code": ["", [
            Validators.required, Validators.minLength(4)
        ], []]
    });
  }

  ngOnInit() {
  }

  doVerify() {

    if (this.form.valid) {
      let navigationExtras: NavigationExtras = {
        state: {data: this.userRegister}
      };
      this.navCtrl.navigateForward(['/recovery-password-code-step2'], navigationExtras);
    }

  }

  checkCode() {
    this.errors.code = [];
    if (this.field('code').invalid){
      this.addError("code", "Error: Código inválido.");
    }
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

  reSendCode() {
    console.log("reSendCode");
  }

}