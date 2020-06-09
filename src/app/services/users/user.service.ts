import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserInterface } from '../../interfaces/user';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';
import { Platform } from '@ionic/angular';
import { FCM } from '@ionic-native/fcm/ngx';

const baseUrl = environment.baseUrl;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: UserInterface;
  isShowingPopUp = false;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private platform: Platform,
    private fcm: FCM,
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
      guest: false
    }
  }

  loginAsGuest() {
    this.setUpUser();
    this.user.first_name = "Invitado";
    this.user.guest = true;
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
    await this.storage.removeObject("location");
  }

  register(form) {
    const body = {
      username: form.email,
      password: form.password,
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName
    }
    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}users/`, body).subscribe((response) => {
        resolve(response);
      }, (errorResponse) => {
        reject(JSON.parse(errorResponse._body));
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
        reject(JSON.parse(errorResponse._body));
      })
    })
  }

  saveChanges(first_name: string, last_name: string) {
    const body = {
      first_name,
      last_name
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.user.token}`
    });
    return new Promise((resolve, reject) => {
      this.http.put(`${apiUrl}users/${this.user.id}/change/`, body, { headers })
        .subscribe(async (response: any) => {
          let returnedUser: UserInterface = JSON.parse(response._body)
          this.user = { ...returnedUser, token: this.user.token }
          resolve(response)
        }, (errorResponse) => {
          reject(JSON.parse(errorResponse._body))
        })
    })
  }

  loginGoogle() {
    console.log("G+ | User");
    // this.google.login(firebaseConfig).then(res => {
    //   console.log(res);
    //   const user_data_google = res;
    // });
  }

  loginFcbk() {
    console.log("Fcbk");
  }

}
