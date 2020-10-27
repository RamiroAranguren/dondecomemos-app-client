import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { UsersService } from '../../services/users/user.service';
import { UserInterface } from '../../interfaces/user';
import { StorageService } from '../../services/storage/storage.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    guestStatus = true;
    menuHide = false;
    backButtonSuscription: any;

    loginSocial = {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        net: null,
        data: null
    };

    initals = "";

    form: FormGroup;

    errors = {
        email: [],
        phone: [],
        firstName: [],
        lastName: []
    }

    user: any = {
        id: "",
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        token: "",
        guest: false,
        phone: null
    };

    options = {
        option1: false,
        option2: true
    }

    showAppleSignIn:boolean = false;

    constructor(
        public alertCtrl: AlertController,
        private navCtrl: NavController,
        private userService: UsersService,
        private storage: StorageService,
        private loader: LoaderService,
        public formBuild: FormBuilder,
        private toast: ToastService,
        private platform: Platform,
        private router: Router,
        private facebook: Facebook,
        private google: GooglePlus,
        private signInWithApple: SignInWithApple
    ) {
        this.form = this.formBuild.group({
            "first_name": ["", [Validators.required], []],
            "last_name": ["", [Validators.required], []],
            "email": ["", [
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ], []],
            "phone": ["", [
                Validators.required
            ], []],
        });
    }

    ngOnInit() {
        this.showAppleSignIn = this.platform.is('ios');
        this.storage.getObject("user").then((user: UserInterface) => {
            this.user = user;
            this.initals = `${this.user.first_name.slice(0, 1)}${this.user.last_name.slice(0, 1)}`;
        }).catch(err => {
            this.user = {
                id: "",
                username: "",
                password: "",
                email: "",
                first_name: "",
                last_name: "",
                token: "",
                guest: true,
                phone: null
            };
        });
    }

    ionViewDidEnter() {
        let isGuest = this.userService.isGuestUser();
        if (isGuest) {
            this.guestStatus = true;
        } else {
            this.guestStatus = false;
            this.menuHide = true;
        }
        this.backToHomeSuscription();
    }


    ionViewWillLeave() {
        this.guestStatus = true;
        this.menuHide = false;
        this.backButtonSuscription.unsubscribe();
    }

    backToHomeSuscription() {
        this.backButtonSuscription = this.platform.backButton.subscribe(() => {
            this.router.navigate(['tabs/home'])
        })
    }

    async logOut() {
        const alert = await this.alertCtrl.create({
            header: 'Cerrar Sesión',
            message: '¿Seguro quiere cerrar sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Cerrar sesión',
                    handler: () => {
                        if(this.userService.user.net === null){
                            this.userService.logout();
                            this.userService.loginAsGuest();
                        } else {
                            // LOGOUT DE FB - G+
                            if(this.userService.user.net === 'facebook'){
                                this.userService.logoutFb();
                            }
                            if(this.userService.user.net === 'google'){
                                this.userService.logoutGplus();
                            }
                        }
                        this.navCtrl.navigateRoot('/tabs/home');
                    }
                }
            ]
        });

        await alert.present();
    }

    legalView() {
        this.backButtonSuscription.unsubscribe();
        this.navCtrl.navigateForward(['/legal'])
    }

    dataView() {
        this.backButtonSuscription.unsubscribe();
        this.navCtrl.navigateForward(['/profile-data']);
    }

    login() {
        this.navCtrl.navigateForward(['/login']);
    }

    register() {
        this.navCtrl.navigateForward(['/register']);
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
            this.toast.show("Hubo un error al intentar ingresar con Google");
        });
    }

    addError(key, msg) {
        this.errors[key].push(msg)
    }

    field(fieldName) {
        return this.form.controls[fieldName]
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
