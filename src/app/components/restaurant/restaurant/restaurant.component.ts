import { Component, OnInit, Input } from '@angular/core';
import { restaurant } from '../../../interfaces/restaurant';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {

  @Input() restaurants: restaurant[];

  constructor() { }

  ngOnInit() {
  }

}
