import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-security-card-code-american',
    templateUrl: './security-card-code-american.component.html',
    styleUrls: ['./security-card-code-american.component.scss'],
})
export class SecurityCardCodeAmericanComponent implements OnInit {

    constructor(
        private popoverController: PopoverController
    ) { }

    ngOnInit() { }

    async dismissPopover(){
        await this.popoverController.dismiss()
    }
}
