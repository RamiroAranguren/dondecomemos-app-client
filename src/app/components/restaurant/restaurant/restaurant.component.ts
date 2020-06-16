import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

import { restaurant } from '../../../interfaces/restaurant';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {

  @Input() restaurants: restaurant[];

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  details(resto:restaurant) {
    let params: NavigationExtras = {state: {data: resto}};
    this.navCtrl.navigateForward(['/details'], params);
  }

}
