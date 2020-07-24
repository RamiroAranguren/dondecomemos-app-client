import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UsersService } from '../../services/users/user.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-verify-number-code',
  templateUrl: './verify-number-code.page.html',
  styleUrls: ['./verify-number-code.page.scss'],
})
export class VerifyNumberCodePage implements OnInit {

  form: FormGroup;

  user:any;

  errors = {
    code: []
  }

  numberRegister = {
    code: null
  }

  constructor(
    private route: Router,
    public formBuild: FormBuilder,
    private navCtrl: NavController,
    private userService: UsersService,
    private loader: LoaderService
  ) {
    this.form = this.formBuild.group({
        "code": ["", [
          Validators.required, Validators.minLength(4)
        ], []],
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
    this.sendSMS();
  }

  sendSMS() {
    this.userService.sendCodeSms(this.user.email, this.user.phone);
  }

  doVerify() {
    this.userService.checkCodeSms(this.numberRegister.code).then(() => {
      setTimeout(() => {
        if (this.user.net !== null) {
          // CUANDO EL REGISTRO VIENE DE UNA RED SOCIAL, LLAMA A LA FUNCION
          // LOGIN Y LOGUEA DIRECTAMENTE AL USUARIO
          this.loginNet();
        } else {
          // CUANDO ES UN REGISTRO CLASICO REDIRECCIONA AL LOGIN
          this.userService.login(this.user.email, this.user.password).then(res => {
            console.log("Verify-Login", res);
            this.navCtrl.navigateRoot('/tabs/home');
          }).catch(errors => {
            console.log(errors);
          })
          // this.navCtrl.navigateRoot('/login');
        }
      }, 2000);
    }).catch((error) => {
      this.errors.code = ["Error: no se pudo validar el código, intente de nuevo."];
    })
  }

  reSendSMS() {
    this.loader.display('Enviando nuevo código...');
    this.userService.sendCodeSms(this.user.email, this.user.phone).then(() => {
      this.loader.hide();
    }).catch(() => {
      this.loader.hide();
      this.errors.code = ["Error: no se pudo enviar, intente de nuevo."];
    })
  }

  loginNet() {
    console.log("loginNet", this.user.email, this.user.password);
    this.userService.login(this.user.email, this.user.password).then(res => {
      console.log("Verify-Login", res);
      this.navCtrl.navigateRoot('/tabs/home');

    }).catch(errors => {
      console.log(errors);
    })
  }

}
