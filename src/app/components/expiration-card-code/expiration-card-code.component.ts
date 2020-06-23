import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-expiration-card-code',
  templateUrl: './expiration-card-code.component.html',
  styleUrls: ['./expiration-card-code.component.scss'],
})
export class ExpirationCardCodeComponent implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

async dismissPopover(){
    await this.popoverController.dismiss()
}
}
