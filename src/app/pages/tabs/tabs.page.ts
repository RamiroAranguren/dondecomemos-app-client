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
    this.loadData();
    this.backToHomeSuscription();
    let tab = this.tabRef.getSelected();
    console.log("TAAA", tab);
    if(tab === 'favorite'){
      this.favoritePage.ionViewWillEnter();
    }
  }

  ionViewWillLeave(){
    console.log("a2");
    this.loadData();
    this.backButtonSuscription.unsubscribe();
  }

  ionTabsWillChange() {
    console.log("ACAAAA-2");
  }

  ionTabsDidChange() {
    console.log("ACAAAA-3");
  }

  backToHomeSuscription() {
    this.backButtonSuscription = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('tabs/home');
    })
  }

  loadData(){
    console.log("data define tags");
  }
}
