import { Component, OnInit } from '@angular/core';
import { creditCard } from 'src/app/interfaces/credit-card';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { CardCodeComponent } from '../card-code/card-code.component';


@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss'],
})
export class CreditCardListComponent implements OnInit {

  public cards: Array<any> = [
    {
      company: "VISA",
      number: 1564,
      name: "emilio",
      img: "../",

    },
    {
      company: "mastercad",
      number: 1564,
      name: "jose",
      img: "",
    },
    {
      company: "maestro",
      number: 1564,
      name: "biasizo",
      img: "",
    },
    {
      company: "naranja",
      number: 1564,
      name: "mena",
      img: "",
    },

  ];

  constructor(private router: Router,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  navigate(){
    //navegar 
    this.router.navigate(['/credit-card-add']); 
    // dissmis el popup
    this.DismissClick();
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }


  async presentCardCode(ev: any) {
    this.DismissClick()
    const cardCodePop = await this.popoverController.create({
      component: CardCodeComponent,
      cssClass: 'cardcodeclass',
      event: ev,
      translucent: true
    });
    return await cardCodePop.present();
  }







}
