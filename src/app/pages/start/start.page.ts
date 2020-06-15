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

  loginSocialGplus = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    net: null
  }

  loginSocialFcbk = {
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
    // let data_fcbk = this.userService.loginFcbk();
    this.userService.loginFcbk().then(res => {
      console.log("START-DATA-USER-FCBK", res);
      this.loginSocialFcbk.net = "facebook";
      this.loginSocialFcbk.email = res.email;
      this.loginSocialFcbk.password = res.uid;
      if (res.displayName && res.displayName !== "") {
        let namelong = res.displayName.split(" ");
        this.loginSocialFcbk.first_name = namelong[0];
        this.loginSocialFcbk.last_name = namelong[1];
      }
      console.log("data register", this.loginSocialFcbk);
      // INTENTA REGISTRAR AL USER FACEBOOK
      this.userService.register(this.loginSocialFcbk).then(() => {
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocialFcbk}
        };
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      }).catch((error) => {
        console.log(error);
        this.toast.show("Hubo un error al intentar login con Facebook", error);
        // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
        if (error.username && error.username.length > 0){
          this.userService.login(this.loginSocialFcbk.email, this.loginSocialFcbk.password).then(res => {
            console.log("LOGIN-START", res);
            this.navCtrl.navigateRoot('/tabs/home');
          })
          .catch(errors => {
            console.log(errors);
            this.toast.show("Hubo un error al intentar login con Facebook", errors);
          });
        }
      });
    }).catch(error => {
      this.toast.show("Hubo un error al intentar ingresar con Facebook", error);
    })
  }

  loginGoogle(){
    console.log('g+');
    this.userService.loginGoogle().then(res => {
      console.log("START-DATA-USER-G+", res);
      this.loginSocialGplus.net = "google";
      this.loginSocialGplus.email = res.email;
      this.loginSocialGplus.password = res.uid;
      if (res.displayName && res.displayName !== "") {
        let namelong = res.displayName.split(" ");
        this.loginSocialGplus.first_name = namelong[0];
        this.loginSocialGplus.last_name = namelong[1];
      }
      // INTENTA REGISTRAR AL USER G+
      this.userService.register(this.loginSocialGplus).then(() => {
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocialGplus}
        };
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      }).catch((error) => {
        console.log("error-register", error);
        // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
        if (error.username && error.username.length > 0){
          this.userService.login(this.loginSocialGplus.email, this.loginSocialGplus.password).then(res => {
            console.log("LOGIN-START", res);
            this.navCtrl.navigateRoot('/tabs/home');
          })
          .catch(errors => {
            console.log(errors);
            this.toast.show("Hubo un error al intentar login con Google", errors);
          });
        }
      });
    }).catch(error => {
      this.toast.show("Hubo un error al intentar ingresar con Google", error);
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
