import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  backButtonSuscription: any;
  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter(){
    this.loadData();
    //this.backToHomeSuscription();
  }

  ionViewWillLeave(){
    console.log("a2");
    this.loadData();
    //this.backButtonSuscription.unsubscribe();
  }

  backToHomeSuscription() {
    //this.backButtonSuscription = this.platform.backButton.subscribe(() => {
      //this.router.navigateByUrl('tabs/home');
    //})
  }

  loadData(){
    console.log("data define tags");
  }
}
