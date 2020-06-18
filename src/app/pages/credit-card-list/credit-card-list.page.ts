import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CreditCardListComponent } from 'src/app/components/credit-card-list/credit-card-list.component';



@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.page.html',
  styleUrls: ['./credit-card-list.page.scss'],
})
export class CreditCardListPage implements OnInit {

  constructor(public popOC: PopoverController) { }

  ngOnInit() { }

  async presentPopover(ev: any) {
    const myCards = await this.popOC.create({
      component: CreditCardListComponent,
      cssClass: 'cardsPopover',
      event: ev,
      translucent: true
    });
    return await myCards.present();
  }



  

}
