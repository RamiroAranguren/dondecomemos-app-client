import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  menuHide = true;

  constructor(
    private navCtrl: NavController,
    private userService: UsersService
  ) { }

  ngOnInit() {
    let isGuest = this.userService.isGuestUser();
    if(isGuest){
      this.menuHide = false;
    }
  }

  login() {
    this.navCtrl.navigateRoot('/login');
  }

  register() {
    this.navCtrl.navigateRoot('/register');
  }

}
