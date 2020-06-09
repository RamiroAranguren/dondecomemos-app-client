import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';


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
    passwordConfirmation: "",
    firstName: "",
    lastName: ""
  }

  constructor(public formBuild: FormBuilder) {
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

  doRegister(event) {
    // if (this.form.valid) {
      // if (this.userRegister.password === this.userRegister.passwordConfirmation) {
      //   this.userRegister.email = this.userRegister.email
      //   this.loader.display('Registrando')
      //   this.userProvider.register(this.userRegister).then(() => {
      //     this.navCtrl.setRoot(LoginPage)
      //     this.loader.hide()
      //   }).catch((error) => {
      //     if (error.username && error.username.length > 0)
      //       this.errors.email.push("Este email ya se encuentra en uso")
      //     this.loader.hide()
      //   })
      // } else {
        // this.toastProvider.show("Las contraseñas no coinciden")
      // }
    // }
  }

  // checkErrors() {
  //   this.checkPassword();
  //   this.checkEmail();
  //   // this.checkFirstName();
  // }

  // checkFirstName() {
  //   this.errors.firstName = []
  //   if (this.field('firstName').invalid)
  //     this.addError("firstName", "El nombre es demasiado corto")
  // }

  // checkLastName() {
  //   this.errors.lastName = []
  //   if (this.field('lastName').invalid)
  //     this.addError("lastName", "El apellido es demasiado corto")
  // }

  checkPassword() {
    this.errors.password = []
    console.log("checkPassword", this.field('password'));
    if (this.field('password').invalid)
      this.addError("password", "Error: La contraseña tiene menos de 6 carateres.");
  }

  checkEmail() {
    this.errors.email = []
    console.log("checkEmail", this.field('email'));
    if (this.field('email').invalid)
      this.addError("email", "Error: Email inválido.");
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

  // isValid() {
  //   return this.form.valid && this.userRegister.password === this.userRegister.passwordConfirmation
  // }

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
