import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/user.service';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { restaurant } from 'src/app/interfaces/restaurant';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { StorageService } from '../../services/storage/storage.service';
import { ToastService } from '../../services/toast/toast.service';
import { UserInterface } from 'src/app/interfaces/user';
import { NavigationExtras } from '@angular/router';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  isGuest = true;

  showAppleSignIn:boolean = false;

  resto_favs: any[] = [];
  favorites: any[] = [];
  spinnFavorite = true;
  user:UserInterface;

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
    private alertCtrl: AlertController,
    private platform: Platform,
    private storage: StorageService,
    private userService: UsersService,
    private favService: FavoritesService,
    private toastCtrl: ToastService,
    private facebook: Facebook,
    private google: GooglePlus
  ) {
    console.log("constructor");
  }

  ngOnInit() {
    console.log("INIT");
    this.showAppleSignIn = this.platform.is('ios');
    this.storage.getObject("favorites").then(res => {
      if(res){
        this.favorites = res;
      }
    });
  }

  loadData(){
    this.user = this.userService.user;
    if(this.user.guest){
      this.isGuest = true;
    } else {
      this.isGuest = false;
      // this.loader.display("Cargando favoritos...");
      setTimeout(() => {
        this.favService.get(this.user.id).then((res:any) => {
          // this.loader.hide();
          this.resto_favs = res;
          this.storage.addObject("favorites", res);
          this.spinnFavorite = false;
        }).catch(err => {
          // this.loader.hide();
          this.spinnFavorite = false;
          console.log('err-get-favs', err);
        });
      }, 800);
    }
  }

  ionViewWillEnter() {
    console.log("ACAA SIEMPRE");
    this.spinnFavorite = true;
    this.user = this.userService.user;
    if(this.user.guest){
      this.isGuest = true;
    } else {
      this.isGuest = false;
      setTimeout(() => {
        this.favService.get(this.user.id).then((res:any) => {
          this.resto_favs = res;
          this.storage.addObject("favorites", res);
          this.spinnFavorite = false;
        }).catch(err => {
          this.spinnFavorite = false;
          console.log('err-get-favs', err);
        });
      }, 800);
    }
  }

  removeFav(fav_id:number) {
    this.showAlert(fav_id);
  }

  async showAlert(id:number) {

    let alert = await this.alertCtrl.create({
      header: 'Eliminar de favoritos',
      message:"¿Seguro quiere eliminar al restaurante de Favoritos?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.storage.getObject("favorites").then(res => {
              this.favService.delete(id).then((res:any) => {
                let id_fav_resto = this.favorites.filter(fav => fav.id !== id);
                this.storage.addObject("favorites", id_fav_resto);
                this.resto_favs = this.resto_favs.filter(fav_resto => fav_resto.id !== id);
                this.toastCtrl.show("Eliminado de Favoritos");
              });
            }).catch(err => {
              console.log('err', err);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  login() {
    this.navCtrl.navigateForward(['/login']);
  }

  register() {
    this.navCtrl.navigateForward(['/register']);
  }

  details(resto:restaurant) {
    let params: NavigationExtras = {state: {data: resto, call: 'favorite'}};
    this.navCtrl.navigateForward(['/restaurant/details'], params);
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
        this.userService.login(data.email, data.id, "facebook").then(res => {
        this.navCtrl.navigateRoot('/tabs/home');
        }).catch(error => {
        console.log("Error Login", error);
        let navigationExtras: NavigationExtras = {
            state: {data: this.loginSocial}};
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
        });
    }).catch(error =>{
        this.toastCtrl.show(`Hubo un error al intentar ingresar con Facebook`);
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
        this.userService.login(data.email, data.id, "google").then(res => {
        this.navCtrl.navigateRoot('/tabs/home');
        }).catch(error => {
        console.log("Error Login", error);
        let navigationExtras: NavigationExtras = {
            state: {data: this.loginSocial}};
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
        });
    }).catch(err => {
        console.log(`Error ${JSON.stringify(err)}`);
        this.toastCtrl.show("Hubo un error al intentar ingresar con Google");
    });
  }
  async loginApple() {
    console.log("loginApple");
    this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    })
    .then((res: AppleSignInResponse) => {
      // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
      // alert('Send token to apple for verification: ' + res.identityToken);
      // console.log(res);
      // this.toast.show("1: "+res);
      // this.dataApple = res;
      ////////////
      this.loginSocial.net = "ios";
      this.loginSocial.data = res;
      this.loginSocial.email = res.email;
      this.loginSocial.password = res.identityToken;
      this.loginSocial.first_name = res.fullName.givenName;
      this.loginSocial.last_name = res.fullName.familyName;
      // SE INTENTA LOGUEAR PRIMERO POR SI YA ESTA REGISTRADO
      // SINO, SE LO ENVIA A REGISTRAR
      this.userService.login(res.email, res.identityToken, "ios").then(res => {
        this.navCtrl.navigateRoot('/tabs/home');
      }).catch(error => {
        console.log("Error Login", error);
        let navigationExtras: NavigationExtras = {
          state: {data: this.loginSocial}};
        this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
      });

    })
    .catch((error: AppleSignInErrorResponse) => {
      // alert(error.code + ' ' + error.localizedDescription);
      console.error("2:"+error);
      // this.toast.show("2: "+error);
      // this.dataApple = `${error.code} - ${error.localizedDescription}`;
    });
  }

}
