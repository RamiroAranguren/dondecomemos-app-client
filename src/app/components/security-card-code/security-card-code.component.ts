import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-security-card-code',
    templateUrl: './security-card-code.component.html',
    styleUrls: ['./security-card-code.component.scss'],
})
export class SecurityCardCodeComponent implements OnInit {

    constructor(
        private popoverController: PopoverController
    ) { }

    ngOnInit() { }
    async dismissPopover(){
        await this.popoverController.dismiss()
    }
}
