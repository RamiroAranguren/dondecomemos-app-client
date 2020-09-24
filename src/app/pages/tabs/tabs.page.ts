import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoritePage } from '../favorite/favorite.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  backButtonSuscription: any;
  @ViewChild('myTabs') tabRef: IonTabs;

  @ViewChild('fav') favoritePage: FavoritePage;

  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter(){
    this.backToHomeSuscription();
    this.backToFavoriteSuscription();
  }

  ionViewWillLeave(){
    this.backButtonSuscription.unsubscribe();
  }

  backToHomeSuscription() {
    this.backButtonSuscription = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('tabs/home');
    })
  }

  backToFavoriteSuscription() {
    console.log("backToFavoriteSuscription");
    // this.backButtonSuscription = this.platform.backButton.subscribe(() => {
    //   this.favoritePage.ionViewWillEnter();
    // })
  }
}
