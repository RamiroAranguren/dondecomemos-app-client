import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';
import { NavController, Platform } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


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
    private appMinimize: AppMinimize,
    private facebook: Facebook,
    private google: GooglePlus
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
    this.facebook.login(['public_profile', 'email']).then(rta => {
      console.log(rta.status);
      if(rta.status == 'connected'){
        this.getInfo();
      }
    })
    .catch(error =>{
      console.error( error );
    });
    // this.userService.loginFcbk();
    // setTimeout(() => {
    //   try {
    //     this.loginSocialFcbk.net = "facebook";
    //     this.loginSocialFcbk.email = this.userService.userFcbk.email;
    //     this.loginSocialFcbk.password = this.userService.userFcbk.id;
    //     this.loginSocialFcbk.first_name = this.userService.userFcbk.first_name;
    //     this.loginSocialFcbk.last_name = this.userService.userFcbk.last_name;
    //     let navigationExtras: NavigationExtras = {
    //       state: {data: this.loginSocialFcbk}};
    //     this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    //   } catch (error) {
    //     console.log("FCBK-ERROR", error);
    //     console.log("FCBK-ERROR-JSON", JSON.stringify(error));
    //     this.toast.show(`Hubo un error al intentar ingresar con Facebook`);
    //   }
      
    // }, 4000);
    // .then(res => {
    //   console.log("FCBK-RES", res);
    //   this.loginSocialFcbk.net = "facebook";
    //   this.loginSocialFcbk.email = res.email;
    //   this.loginSocialFcbk.password = res.uid;
    //   if (res.displayName && res.displayName !== "") {
    //     let namelong = res.displayName.split(" ");
    //     this.loginSocialFcbk.first_name = namelong[0];
    //     this.loginSocialFcbk.last_name = namelong[1];
    //   }
    //   console.log("data register", this.loginSocialFcbk);
    //   let navigationExtras: NavigationExtras = {
    //     state: {data: this.loginSocialFcbk}};
    //   this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    // }).catch(error => {
    //   console.log("FCBK-ERROR", error);
    //   console.log("FCBK-ERROR-JSON", JSON.stringify(error));
    //   this.toast.show(`Hubo un error al intentar ingresar con Facebook`);
    // })
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then((data:any) => {
      console.log("data_fcbk-antes", data);
      this.loginSocialFcbk.net = "facebook";
      this.loginSocialFcbk.email = this.userService.userFcbk.email;
      this.loginSocialFcbk.password = this.userService.userFcbk.id;
      this.loginSocialFcbk.first_name = this.userService.userFcbk.first_name;
      this.loginSocialFcbk.last_name = this.userService.userFcbk.last_name;
      let navigationExtras: NavigationExtras = {
        state: {data: this.loginSocialFcbk}};
      this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    }).catch(error =>{
      console.log("FCBK-ERROR", error);
      console.log("FCBK-ERROR-JSON", JSON.stringify(error));
      this.toast.show(`Hubo un error al intentar ingresar con Facebook`);
    });
  }

  loginGoogle(){
    console.log('g+');
    this.google.login({}).then(result => {
      console.log("RES-G+", result);
      this.loginSocialGplus.net = "google";
      this.loginSocialGplus.email = result.email;
      this.loginSocialGplus.password = result.uid;
      if (result.displayName && result.displayName !== "") {
        let namelong = result.displayName.split(" ");
        this.loginSocialGplus.first_name = namelong[0];
        this.loginSocialGplus.last_name = namelong[1];
      }
      let navigationExtras: NavigationExtras = {
        state: {data: this.loginSocialGplus}};
      this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    }).catch(err => {
      console.log(`Error ${JSON.stringify(err)}`);
      this.toast.show("Hubo un error al intentar ingresar con Google");
    });
    // this.userService.loginGoogle().then((res:any) => {
    //   console.log("DATA-RES-G+", res);
    //   const userGplus = res;
    //   console.log("START-DATA-USER-G+", userGplus);
    //   this.loginSocialGplus.net = "google";
    //   this.loginSocialGplus.email = userGplus.email;
    //   this.loginSocialGplus.password = userGplus.uid;
    //   if (userGplus.displayName && userGplus.displayName !== "") {
    //     let namelong = userGplus.displayName.split(" ");
    //     this.loginSocialGplus.first_name = namelong[0];
    //     this.loginSocialGplus.last_name = namelong[1];
    //   }

    //   console.log("Data for register", this.loginSocialGplus);
    //   // INTENTA REGISTRAR AL USER G+
    //   this.userService.register(this.loginSocialGplus).then(() => {
    //     let navigationExtras: NavigationExtras = {
    //       state: {data: this.loginSocialGplus}
    //     };
    //     this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
    //   }).catch((error) => {
    //     console.log("error-register", error);
    //     // SI YA EXISTE USUARIO CON ESE EMAIL LO QUE HACE ES LOGUEAR A ESE USER
    //     if (error.username && error.username.length > 0){
    //         this.toast.show("Hubo un error al intentar login con Google");
    //     }
    //   });
    // }).catch(error => {
    //   console.log(error);
    //   this.toast.show("Hubo un error al intentar ingresar con Google");
    // })
  }

  loginAsGuestUser() {
    this.userService.loginAsGuest();
    this.navCtrl.navigateRoot('/tabs/home');
  }

}
