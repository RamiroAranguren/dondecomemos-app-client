import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';

import { restaurant } from '../../interfaces/restaurant';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  type = 'password'

  errors: any
  restaurant: restaurant;

  user = {
    email: null,
    password: null
  };

  form: FormGroup;
  error = {
      mensaje: "Ok",
      status: 200,
      ok: true
  };

  constructor(
    private route: Router,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public formBuild: FormBuilder,
    public menuCtrl: MenuController,
    private userService: UsersService,
    private loader: LoaderService
    ) {

      this.form = this.formBuild.group({
          "email": ["", [
              Validators.required,
              Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ], []],
          "password": ["", [
            Validators.required, Validators.minLength(5)
          ], []],
      });
  }

  ngOnInit() {
    this.error.mensaje = "";
    this.user = {
      email: "",
      password: ""
    };
    try {
      this.user = this.route.getCurrentNavigation().extras.state.data;
    } catch (error) {
      console.log("Init-Login");
    }

  }

  doLogin( event ) {

    this.error.mensaje = "";
    this.loader.display('Iniciando sesión...').then(() => {
      this.userService.login(this.form.value.email, this.form.value.password).then(() => {
        if (this.restaurant) {
          // this.viewController.dismiss()
        } else {
          this.navCtrl.navigateRoot('/tabs/home')
        }
        this.loader.hide();
      }).catch(errors => {
        this.error.status = errors.status;
        this.error.ok = false;
        this.error.mensaje = "Error: Email y/o contraseña inválidos."
        this.loader.hide();
      });
    }).catch(err => {
      console.log("error", err);
      this.loader.hide();
    });
  }

  forgotPassword() {
    let navigationExtras: NavigationExtras = {state: {data: this.user}};
    this.navCtrl.navigateForward(['/recovery-password-email-step1'], navigationExtras);
  }

  showPassword() {
    this.type = this.type == 'password' ? 'text' : 'password'
  }

}
