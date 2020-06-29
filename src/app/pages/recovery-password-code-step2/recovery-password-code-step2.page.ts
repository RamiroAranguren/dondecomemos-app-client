import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

import { UsersService } from '../../services/users/user.service';

@Component({
  selector: 'app-recovery-password-code-step2',
  templateUrl: './recovery-password-code-step2.page.html',
  styleUrls: ['./recovery-password-code-step2.page.scss'],
})
export class RecoveryPasswordCodeStep2Page implements OnInit {

  user:any;
  form: FormGroup;

  errors = {
    code: []
  }

  userRegister = {
    code: "",
    email: null
  }

  constructor(
    private route: Router,
    public formBuild: FormBuilder,
    public navCtrl: NavController,
    private userService: UsersService
  ) {
    this.form = this.formBuild.group({
        "code": ["", [
            Validators.required, Validators.minLength(6)
        ], []]
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
    this.userRegister.email = this.user.email;
  }

  doVerify() {

    if (this.form.valid) {
      
      this.userService.checkCodeProvider(this.userRegister.code, this.userRegister.email).then(() => {
        
        let navigationExtras: NavigationExtras = {
          state: {data: this.userRegister}
        };
        this.navCtrl.navigateForward(['/change-password'], navigationExtras);
      }).catch(() => {
        
        this.errors.code = ['Error: código incorrecto.'];
      });
    }

  }

  checkCode() {
    this.errors.code = [];
    if (this.field('code').invalid){
      this.addError("code", "Error: Código inválido.");
    }
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

  reSendCode() {
    
    this.userService.recoverPassword(this.user.email).then(() => {
    
    }).catch(() => {
    
      this.addError("code", "Error: no se pudo enviar el email.");
    })
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

}