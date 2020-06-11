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
    this.loader.display('Verificando código...');
    this.userService.checkCodeSms(this.numberRegister.code).then(() => {
      setTimeout(() => {
        this.loader.hide();
        this.navCtrl.navigateRoot('/login');
      }, 3000);
    }).catch((error) => {
      this.errors.code = ["Error: no se pudo validar el código, intente de nuevo."];
      this.loader.hide();
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

}
