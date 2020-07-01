import { Component, OnInit } from '@angular/core';
import { restaurant } from 'src/app/interfaces/restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qualify-review',
  templateUrl: './qualify-review.page.html',
  styleUrls: ['./qualify-review.page.scss'],
})
export class QualifyReviewPage implements OnInit {

  restaurant:restaurant;
    qualify = false;
    hasReviews = false;
  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
  }



}
