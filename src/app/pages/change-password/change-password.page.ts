import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/user.service';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  userForm = {
    new_password: null,
    copy_password: null
  };

  errors = {
    new_password: [],
    copy_password: []
  }

  type = 'password';
  type2 = 'password';
  form: FormGroup;
  user:any;

  constructor(
    private navCtrl: NavController,
    private route: Router,
    public formBuild: FormBuilder,
    private userService: UsersService,
    private loader: LoaderService
  ) {
    this.form = this.formBuild.group({
        "new_password": ["", [
          Validators.required, Validators.minLength(6)
        ], []],
        "copy_password": ["", [
          Validators.required, Validators.minLength(6)
        ], []],
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
  }

  doSetPassword() {
    this.loader.display('Cambiando su contraseña...');
    setTimeout(() => {
      this.userService.set_password(this.user.email, this.userForm.new_password)
      this.loader.hide();
      this.navCtrl.navigateRoot('/login');
    }, 3000);
  }

  checkPassword1() {
    this.errors.new_password = [];
    if (this.field('new_password').invalid)
      this.addError("new_password", "Error: La contraseña tiene menos de 6 carateres.");
  }

  checkPassword2() {
    if (this.field('copy_password').invalid){
      this.addError("copy_password", "Error: La contraseña tiene menos de 6 carateres.");
    }

    if (this.userForm.new_password  !== this.userForm.copy_password ) {
      this.errors.copy_password = ['Error: las contraseñas no coinciden.'];
    } else {
      this.errors.copy_password = [];
    }
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

  showPassword2() {
    this.type2 = this.type2 == 'password' ? 'text' : 'password'
  }

}
