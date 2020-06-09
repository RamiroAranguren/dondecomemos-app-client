import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
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
    email: null
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
    // public restaurantProvider: RestaurantProvider,
    private loader: LoaderService,
    // private recoverPasswordProvider: RecoverPasswordProvider,
    // public toaster: ToastProvider,
    private errorHandlerService: ErrorHandlerService,
    // public viewController: ViewController
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
    try {
      this.user = this.route.getCurrentNavigation().extras.state.data;
    } catch (error) {
      console.log("Init-Login");
    }

  }

  doLogin( event ) {

    this.error.mensaje = "";

    this.loader.display('Iniciando sesión');

    this.userService.login(this.form.value.email, this.form.value.password)
      .then(() => {
        if (this.restaurant) {
          // this.viewController.dismiss()
        } else {
          this.navCtrl.navigateRoot('/tabs/home')
        }
        this.loader.hide();
      })
      .catch(errors => {
        this.error.status = errors.status;
        this.error.ok = false;
        this.error.mensaje = "Error: Email y/o contraseña inválidos."
        this.loader.hide();
      })
  }

  forgotPassword() {
    let navigationExtras: NavigationExtras = {state: {data: this.user}};
    this.navCtrl.navigateForward(['/recovery-password-email-step1'], navigationExtras);
  }

  async forgotPasswordAlert() {
    const forgotpassw = await this.alertCtrl.create({
      header: 'Recuperar contraseña',
      message: "Ingresa tu email, te mandaremos un código para reestablecer tu contraseña",
      backdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log(data);
            if(data.email !== ""){
              this.recoverPass(data.email);
            } else {
              return false;
            }
          }
        },
      ]
    });
    await forgotpassw.present();
  }

  async inputCodeAlert(mail) {
    const forgotpassw = await this.alertCtrl.create({
      header: 'Ingresa el código que recibiste',
      message: "Si el código es correcto podrás cambiar tu contraseña",
      backdropDismiss: false,
      inputs: [
        {
          name: 'code',
          type: 'email',
          placeholder: 'Código de verificación'
        },
      ],
      buttons: [

        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            if(data.code !== ""){
              this.checkCode(data.code, mail);
            } else {
              return false;
            }
          }
        }
      ]
    });
    await forgotpassw.present();
  }


  acceptedCode() {
    // this.navCtrl.push(CorrectCodePage)
  }

  recoverPass(mail) {
    // this.loader.display('Verificando email');
    // this.recoverPasswordProvider.recoverPassword(mail).then(() => {
    //   this.loader.hide()
    //   this.inputCodeAlert(mail)
    // }
    // ).catch(() => {
    //   this.loader.hide()
    //   this.toaster.show('email incorrecto, intentelo nuevamente')
    // })
  }

  checkCode(code, mail) {
    // this.loader.display('Verificando código');
    // this.recoverPasswordProvider.checkCodeProvider(code, mail).then(() => {
    //   this.loader.hide()
    //   this.navCtrl.push(CorrectCodePage, { mail: mail })
    // }
    // ).catch(() => {
    //   this.loader.hide()
    //   this.toaster.show('código incorrecto, intentelo nuevamente')
    // })
  }

  showPassword() {
    this.type = this.type == 'password' ? 'text' : 'password'
  }

}


//   constructor() { }

//   ngOnInit() {
//   }

// }
