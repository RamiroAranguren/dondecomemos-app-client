import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  user = {
    new_password: null,
    copy_password: null
  };

  errors = {
    new_password: [],
    copy_password: []
  }

  type = 'password';
  form: FormGroup;

  constructor(
    public formBuild: FormBuilder,
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
  }

  checkNewPassword() {
    this.errors.new_password = [];
    if (this.field('password').invalid)
      this.addError("password", "Error: La contraseña tiene menos de 6 carateres.");
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

}
