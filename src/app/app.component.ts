import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage/storage.service';
import { UsersService } from './services/users/user.service';
import { ToastService } from './services/toast/toast.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private storageService: StorageService,
    private userService: UsersService,
    private toastService: ToastService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByName('black');
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
    this.checkFirstTime();
  }

  autoLogin() {
    this.storageService.getObject("user")
      .then((storedUser) => {
        this.userService.login(storedUser.username, storedUser.password)
          .then(() => {
            this.navCtrl.navigateRoot('/tabs/home');
          })
          .catch(errors => {
            this.toastService.show('Ha habido un problema con las credenciales almacenadas');
            this.userService.logout()
              .catch(errors => {
                console.log(errors)
              });

            this.navCtrl.navigateRoot('/start');
          })
      })
      .catch((error) => {
        this.navCtrl.navigateRoot('/start');
      });
  }
  checkFirstTime() {
    this.storage.get('firstTime').then((resp: any) => {
      if (resp == null) {
        console.log('primera vez', resp);
        this.setFirstTime();
      } else {
        console.log('no es primera vez', resp);
        this.autoLogin();
      }
    }).catch(error => {
      this.navCtrl.navigateRoot('/step-functions');
      console.log('primera vez en la app');
    })
  }

  setFirstTime() {
    this.storage.set('firstTime', false).then((res: any) => {
      console.log('first = false');
      this.navCtrl.navigateRoot('/step-functions');
    }).catch((error: any) => {
      console.log('error al setear firstime en storage', error)
    });
  }

}
