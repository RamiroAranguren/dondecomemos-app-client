import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UsersService } from '../../services/users/user.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';

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

  code_server = null;

  constructor(
    private route: Router,
    public formBuild: FormBuilder,
    private navCtrl: NavController,
    private userService: UsersService,
    private loader: LoaderService,
    private toast: ToastService,
    private alertCtrl: AlertController
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
    console.log("Enviando SMS");
    this.userService.sendCodeSms(this.user.email, this.user.phone).then((result:any) => {
      this.code_server = result.code;
    });
  }

  doVerifyAndRegister() {
    this.loader.display('Verificando código...');
    setTimeout(() => {
      this.loader.hide();
      if(this.code_server !== this.numberRegister.code){
        this.errors.code = ["Error: verifique que el código ingresado sea el mismo que recibió."];
      } else {
        //this.userService.checkCodeSms(this.user.email, this.user.phone, this.numberRegister.code).then(() => {
          //this.loader.hide();
          if (this.user.net !== null) {
            // CUANDO EL REGISTRO VIENE DE UNA RED SOCIAL, HACE EL REGISTRO Y LUEGO
            // LOGIN Y LOGUEA DIRECTAMENTE AL USUARIO
            this.loader.display('Registrando usuario...');
            this.userService.register(this.user, this.numberRegister.code).then(() => {
              this.loader.hide();
              console.log("loginNet", this.user.email, this.user.password);
              this.userService.login(this.user.email, this.user.password).then(res => {
                console.log("Verify-Login", res);
                this.navCtrl.navigateRoot('/tabs/home');

              }).catch(error => {
                this.toast.show(`Hubo un error al intentar login ${error}`)
                console.log(error);
              });
            }).catch((error) => {
              this.loader.hide();
              this.toast.show(`Hubo un error al intentar login ${error}`)
              console.log(error);
              if (error.username && error.username.length > 0) {
                this.showAlert();
              }
            });
          } else {
            // CUANDO ES UN REGISTRO CLASICO - HACEMOS EL REGISTRO Y LUEGO LOGIN
            this.loader.display('Registrando usuario...');
            this.userService.register(this.user, this.numberRegister.code).then(() => {
              this.loader.hide();
              this.userService.login(this.user.email, this.user.password).then(res => {
                console.log("Verify-Login", res);
                this.navCtrl.navigateRoot('/tabs/home');
              }).catch(error => {
                console.log("Login-error", error);
              });
            }).catch((error) => {
              this.loader.hide();
              console.log("Register-error", error);
              if (error.username && error.username.length > 0) {
                this.showAlert();
              }
            });
          }
        //}).catch((error) => {
        //  this.errors.code = ["Error: no se pudo validar el código, intente de nuevo."];
        //})
      }
    }, 500);
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Cuenta ya existente',
      message: 'El email ya se encuentra asociado a una cuenta de Donde Comemos',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Iniciar sesión',
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }

  reSendSMS() {
    this.loader.display('Enviando nuevo código...');
    this.userService.sendCodeSms(this.user.email, this.user.phone).then((result:any) => {
      this.code_server = result.code;
      this.loader.hide();
    }).catch(() => {
      this.loader.hide();
      this.errors.code = ["Error: no se pudo enviar, intente de nuevo."];
    })
  }
}
