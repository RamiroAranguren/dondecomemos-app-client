import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

import { restaurant } from '../../../interfaces/restaurant';
import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {

  @Input() restaurants: restaurant[];

  constructor(
    private navCtrl: NavController,
    private nativePageTransitions: NativePageTransitions
  ) { }

  ngOnInit() {
  }

  details(resto:restaurant) {
    this.transitionAnimation();
    let params: NavigationExtras = {state: {data: resto, call: 'home'}};
    this.navCtrl.navigateForward(['/restaurant/details'], params);
  }

  transitionAnimation(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
     }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => console.log(onSuccess))
      .catch(onError => console.log(onError,'error'));
  }

}
