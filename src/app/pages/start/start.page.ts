import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';
import { NavController, Platform } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  backbuttonSubscription: any;
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
    private platform: Platform,
    private loader: LoaderService,
    private userService: UsersService,
    private toast: ToastService,
    private appMinimize: AppMinimize
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
   this.backbuttonSubscription = this.platform.backButton.subscribe(()=>{
      console.log ('minimize');
      this.appMinimize.minimize();
    });
  }

  ionViewWillLeave(){
    this.backbuttonSubscription.unsubscribe();
  }

  activeButton(){
    console.log('ok');
  }

  loginFcbk(){
    this.userService.loginFcbk().then(res => {
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
        // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
        if (error.username && error.username.length > 0){
          this.toast.show("Ya existe un usuario registrado con esa cuenta");
        }
      });
    }).catch(error => {
      console.log(error);
      this.toast.show("Hubo un error al intentar ingresar con Facebook");
    })
  }

  loginGoogle(){
    console.log('g+');
    this.userService.loginGoogle().then((res:any) => {
      console.log("DATA-RES-G+", res);
      const userGplus = res;
      console.log("START-DATA-USER-G+", userGplus);
      this.loginSocialGplus.net = "google";
      this.loginSocialGplus.email = userGplus.email;
      this.loginSocialGplus.password = userGplus.uid;
      if (userGplus.displayName && userGplus.displayName !== "") {
        let namelong = userGplus.displayName.split(" ");
        this.loginSocialGplus.first_name = namelong[0];
        this.loginSocialGplus.last_name = namelong[1];
      }

      console.log("Data for register", this.loginSocialGplus);
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
            this.toast.show("Hubo un error al intentar login con Google");
        }
      });
    }).catch(error => {
      console.log(error);
      this.toast.show("Hubo un error al intentar ingresar con Google");
    })
  }

  loginAsGuestUser() {
    this.userService.loginAsGuest();
    this.navCtrl.navigateRoot('/tabs/home');
  }

}
