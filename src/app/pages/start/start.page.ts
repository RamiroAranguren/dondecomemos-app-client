import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private loader: LoaderService,
    private userService: UsersService
  ) { }

  ngOnInit() {
  }

  activeButton(){
    console.log('ok');
  }

  loginFcbk(){
    console.log('Fcbk');
  }

  loginGoogle(){
    console.log('Fcbk');
  }

  loginAsGuestUser() {
    this.loader.display('Iniciando sesión como invitado...').then(() => {
      this.userService.loginAsGuest();
      this.loader.hide();
      this.navCtrl.navigateRoot('/tabs/home');
    });
  }

}
