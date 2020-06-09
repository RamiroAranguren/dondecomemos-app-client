import { Component } from '@angular/core';

import { Platform, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage/storage.service';
import { UsersService } from './services/users/user.service';
import { LoaderService } from './services/loader/loader.service';
import { ToastService } from './services/toast/toast.service';


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
    // private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.storageService.getObject("user")
      .then((storedUser) => {
        // this.loaderService.display('Espere por favor, iniciando...');
        this.userService.login(storedUser.username, storedUser.password)
          .then(() => {
            this.navCtrl.navigateRoot('/tabs/home');
            // this.loaderService.hide();
          })
          .catch(errors => {
            this.toastService.show('Ha habido un problema con las credenciales almacenadas');
            this.userService.logout()
            .catch(errors => {
              console.log(errors)
            });

            this.navCtrl.navigateRoot('/start');
            // this.loaderService.hide();
          })
      })
      .catch((error) => {
        this.navCtrl.navigateRoot('/step-functions');
      });

  }
}
