import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CreditCardListComponent } from 'src/app/components/credit-card-list/credit-card-list.component';
import { CreditcardsService } from 'src/app/services/creditcards/creditcards.service';
import { StorageService } from '../../services/storage/storage.service';
import { UserInterface } from 'src/app/interfaces/user';



@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.page.html',
  styleUrls: ['./credit-card-list.page.scss'],
})
export class CreditCardListPage implements OnInit {

  list_cards:any[] = [];
  user:UserInterface;

  constructor(
    private popOC: PopoverController,
    private storage: StorageService,
    private cardsService: CreditcardsService
  ) { }

  ngOnInit() {
    this.storage.getObject("user").then((user:UserInterface) => {
      this.user = user;
    })
  }

  ionViewDidEnter() {
    this.cardsService.get(this.user).then((res:any) => {
      this.list_cards = res;
    }).catch(err => {
      console.log("Error get cards", err);
    })
  }

  async presentPopover(ev: any) {
    const myCards = await this.popOC.create({
      component: CreditCardListComponent,
      cssClass: 'cardsPopover',
      event: ev,
      translucent: true,
      componentProps: {
        user: this.user,
        cards: this.list_cards
      }
    });
    return await myCards.present();
  }

}
