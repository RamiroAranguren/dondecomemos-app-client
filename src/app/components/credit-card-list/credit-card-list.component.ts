import { Component, OnInit } from '@angular/core';
import { creditCard } from 'src/app/interfaces/credit-card';

@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss'],
})
export class CreditCardListComponent implements OnInit {

  cards: creditCard[] = [
    {
      company: "VISA",
      number: 1564,
      name: "emilio",
      img: "",

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

  constructor() { }

  ngOnInit() {}

}
