import { Component, OnInit } from '@angular/core';
import { restaurant } from '../../../interfaces/restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  restaurant:restaurant;

  slideOptions = {
    slidesPerView: 2,
    slidesOffsetBefore: -55,
    spaceBetween: 10,
    coverflowEffect: {
      rotate: 50,
      stretch: 30,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  constructor(
    private route: Router
  ) {}

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
  }

}
