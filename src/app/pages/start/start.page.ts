import { Component, OnInit } from '@angular/core';
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

  loginSocial = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    net: null,
    data: null
  };

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
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
      if(rta.status == 'connected'){
        this.getInfo();
      }
    }).catch(error =>{
      console.error( error );
    });
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then((data:any) => {
      this.loginSocial.net = "facebook";
      this.loginSocial.data = JSON.stringify(data);
      this.loginSocial.email = data.email;
      this.loginSocial.password = data.id;
      this.loginSocial.first_name = data.first_name;
      this.loginSocial.last_name = data.last_name;
      // SE INTENTA LOGUEAR PRIMERO POR SI YA ESTA REGISTRADO
      // SINO, SE LO ENVIA A REGISTRAR
      this.userService.login(data.email, data.id).then(res => {
        this.navCtrl.navigateRoot('/tabs/home');
      }).catch(error => {
        console.log("Error Login", error);
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocial}};
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      });
    }).catch(error =>{
      this.toast.show(`Hubo un error al intentar ingresar con Facebook`);
    });
  }

  loginGoogle(){
    this.google.login({}).then(data => {
      this.loginSocial.net = "google";
      this.loginSocial.data = JSON.stringify(data);
      this.loginSocial.email = data.email;
      this.loginSocial.password = data.userId;
      if (data.displayName && data.displayName !== "") {
        let namelong = data.displayName.split(" ");
        this.loginSocial.first_name = namelong[0];
        this.loginSocial.last_name = namelong[1];
      }
      // SE INTENTA LOGUEAR PRIMERO POR SI YA ESTA REGISTRADO
      // SINO, SE LO ENVIA A REGISTRAR
      this.userService.login(data.email, data.id).then(res => {
        this.navCtrl.navigateRoot('/tabs/home');
      }).catch(error => {
        console.log("Error Login", error);
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocial}};
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      });
    }).catch(err => {
      console.log(`Error ${JSON.stringify(err)}`);
      this.toast.show("Hubo un error al intentar ingresar con Google");
    });
  }

  loginAsGuestUser() {
    this.userService.loginAsGuest();
    this.navCtrl.navigateRoot('/tabs/home');
  }

}
