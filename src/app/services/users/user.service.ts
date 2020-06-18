import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserInterface } from '../../interfaces/user';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';
import { Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { UserNetInterface } from '../../interfaces/user-net';


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: UserInterface;
  isShowingPopUp = false;

  userGplus = {
    uid: "",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    name: "",
    picture:""
  }

  userFcbk = {
    uid: "",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    name: "",
    picture:""
  }

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private platform: Platform,
    private fcm: FCM,
    public afAuth: AngularFireAuth,
    private facebook: Facebook,
    private google: GooglePlus
  ) {
    this.setUpUser();
  }

  setUpUser() {
    this.user = {
      id: 0,
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      token: "",
      guest: false,
      phone: null
    }
  }

  loginAsGuest() {
    this.setUpUser();
    this.user.first_name = "Invitado";
    this.user.guest = true;
    // this.storage.addObject("user", this.user);
  }

  isGuestUser() {
    return this.user.guest;
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}login/`, { username, password }).subscribe((res: UserInterface) => {
        this.user.token = res.token;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.user.token}`
        });
        this.http.get(`${apiUrl}users/get_from_token/`, { headers }).subscribe((res: UserInterface) => {
          let token = this.user.token;
          this.user = res;
          this.user.token = token;
          this.user.guest = false;

          //luego de loguear, pido el token y lo envio al back-end
          this.fcm.getToken().then(token => {
            this.registerFcmToken(token, this.user, headers);
          }).catch(err => {
            console.log(err);
          });

          this.storage.addObject("user", { ...this.user, password });
          resolve(this.user);

        }, (res) => {
          reject(res);
        })
      }, (res) => {
        reject(res);
      })
    })
  }

  async logout() {
    await this.storage.removeObject("user");
    await this.storage.removeObject("locations");
    await this.storage.removeObject("favorites");
  }

  register(form) {
    const body = {
      username: form.email,
      password: form.password,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name
    }
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}users/`, body).subscribe((response) => {
        resolve(response);
      }, (errorResponse) => {
        console.log(errorResponse.error);
        reject(errorResponse.error);
      });
    });
  }

  registerFcmToken(token, user, headers) {

    let body = {
      registration_id: token,
      type: 'android',
    };

    if (this.platform.is('ios')) {
      body.type = 'ios';
    }

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}fcm/`, body, { headers }).subscribe((response) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    })
  }

  saveChanges(first_name: string, last_name: string, email: string, phone) {
    const body = {
      first_name,
      last_name,
      email,
      phone
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });
    return new Promise((resolve, reject) => {
      this.http.put(`${apiUrl}users/${this.user.id}/change/`, body, { headers })
        .subscribe(async (response: any) => {
          let returnedUser: UserInterface = response;
          this.user = { ...returnedUser, token: this.user.token }
          resolve(response);
        }, (errorResponse) => {
          reject(errorResponse.error);
        })
    })
  }

  loginGoogle() {
    let data_google = this.google.login({})
      .then(result => console.log(result))
      .catch(err => console.log(`Error ${JSON.stringify(err)}`));

    return data_google;
    // const res = await this.google.login({});
    // const googleCredential = auth.GoogleAuthProvider.credential(res.idToken);
    // const resConfirmed = await this.afAuth.auth.signInWithCredential(googleCredential);
    // const userGplus = resConfirmed.user;
    // console.log("userGplus", userGplus);
    // this.storage.addObject("userGplus", userGplus);
    // return userGplus;
  }

  async loginFcbk() {
    const res: FacebookLoginResponse = await this.facebook.login(['public_profile', 'email']);
    const facebookCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    const resConfirmed = await this.afAuth.auth.signInWithCredential(facebookCredential);
    const dataFcbk = resConfirmed.user;
    console.log("userFcbk", dataFcbk);
    this.storage.addObject("userFcbk", dataFcbk);
    return dataFcbk;
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data => {
      console.log("data_fcbk-antes", data);
      return data;
    })
    .catch(error =>{
      console.error( error );
    });
  }

  recoverPassword(email) {
    const body = { email };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/mail/`, body).subscribe((response: any) => {
        resolve(response)
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    })
  }

  checkCodeProvider(code, email){
    const body = { code, email }
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/checkCode/`, body).subscribe((response: any) => {
        this.user.token = response.token;
        resolve()
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    });
  }

  set_password(email, new_password){
    const body = { new_password, email };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/set_password/`, body, {headers}).subscribe((response: any) => {
        resolve();
      }, (errorResponse) => {
        reject();
      })
    })
  }

  change_password(old_password, new_password) {
    const body = { old_password, new_password };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}recover-password/change_password/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    })
  }

  sendCodeSms(email, phone) {
    const body = { email, phone };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}verify-number-code/sms/`, body).subscribe((response: any) => {
        resolve(response)
      }, (errorResponse) => {
        reject(errorResponse.error)
      })
    })
  }

  checkCodeSms(code){
    const body = { code };
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}verify-number-code/checkCode/`, body).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse.error);
      })
    });
  }


}


// FACEBOOK RESULT
// email: "formingdeveloper@gmail.com"
// first_name: "Forming"
// id: "844450479412313"
// last_name: "Develop"
// name: "Forming Develop"
// picture:
// data:
// height: 50
// is_silhouette: false
// url: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=844450479412313&height=50&width=50&ext=1594593139&hash=AeTKJm2_oYq5vUjQ"
// width: 50
