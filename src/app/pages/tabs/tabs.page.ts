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
    private router: Router,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    this.backToHomeSuscription()
  }

  ionViewWillLeave(){
    this.backButtonSuscription.unsubscribe();
  }
  backToHomeSuscription() {
    this.backButtonSuscription = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('tabs/home');
    })
  }
}
