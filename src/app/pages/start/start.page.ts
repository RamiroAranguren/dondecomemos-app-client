import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  loginSocial = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    net: null
  }

  constructor(
    private navCtrl: NavController,
    private loader: LoaderService,
    private userService: UsersService,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  activeButton(){
    console.log('ok');
  }

  loginFcbk(){
    console.log('Fcbk');
    this.userService.loginFcbk().then(user => {
      this.loginSocial.net = "facebook";
      this.loginSocial.email = user.email;
      this.loginSocial.password = user.uid;
      if (user.displayName && user.displayName !== "") {
        let namelong = user.displayName.split(" ");
        this.loginSocial.first_name = namelong[0];
        this.loginSocial.last_name = namelong[1];
      }
      // INTENTA REGISTRAR AL USER FACEBOOK
      this.userService.register(this.loginSocial).then(() => {
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocial}
        };
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      }).catch((error) => {
        // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
        if (error.username && error.username.length > 0){
          this.userService.login(this.loginSocial.email, this.loginSocial.password).then(res => {
            console.log("LOGIN-START", res);
            this.navCtrl.navigateRoot('/tabs/home');
          })
          .catch(errors => {
            console.log(errors);
            this.toast.show("Hubo un error al intentar ingresar con Facebook");
          });
        }
      });
    }).catch(error => {
      this.toast.show("Hubo un error al intentar ingresar con Google");
    })
  }

  loginGoogle(){
    console.log('g+');
    this.userService.loginGoogle().then(user => {
      this.loginSocial.net = "google";
      this.loginSocial.email = user.email;
      this.loginSocial.password = user.uid;
      if (user.displayName && user.displayName !== "") {
        let namelong = user.displayName.split(" ");
        this.loginSocial.first_name = namelong[0];
        this.loginSocial.last_name = namelong[1];
      }
      // INTENTA REGISTRAR AL USER G+
      this.userService.register(this.loginSocial).then(() => {
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocial}
        };
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      }).catch((error) => {
        // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
        if (error.username && error.username.length > 0){
          this.userService.login(this.loginSocial.email, this.loginSocial.password).then(res => {
            console.log("LOGIN-START", res);
            this.navCtrl.navigateRoot('/tabs/home');
          })
          .catch(errors => {
            console.log(errors);
            this.toast.show("Hubo un error al intentar ingresar con Google");
          });
        }
      });
    }).catch(error => {
      this.toast.show("Hubo un error al intentar ingresar con Google");
    })
  }

  loginAsGuestUser() {
    this.loader.display('Iniciando sesión como invitado...').then(() => {
      this.userService.loginAsGuest();
      this.loader.hide();
      this.navCtrl.navigateRoot('/tabs/home');
    });
  }

}
