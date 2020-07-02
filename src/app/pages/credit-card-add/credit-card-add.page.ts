import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { PopoverController, NavController } from '@ionic/angular';
import { ExpirationCardCodeComponent } from 'src/app/components/expiration-card-code/expiration-card-code.component';
// import { SecurityCardCodeComponent } from 'src/app/components/security-card-code/security-card-code.component';
import { SecurityCardCodeAmericanComponent } from 'src/app/components/security-card-code-american/security-card-code-american.component';

// import { PopoverComponent } from '../../component/';
import { UserInterface } from 'src/app/interfaces/user';
import { Router } from '@angular/router';
import { CreditcardsService } from '../../services/creditcards/creditcards.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
    selector: 'app-credit-card-add',
    templateUrl: './credit-card-add.page.html',
    styleUrls: ['./credit-card-add.page.scss'],
})
export class CreditCardAddPage implements OnInit {

    currentPopover: any;
    user:UserInterface;
    card:any;

    isFocus = {
        titularFocus: false,
        documentFocus: false,
        numberFocus: false,
        expireFocus: false,
        // securityCodeFocus: false,
    }

    errorMessages = {
        titular: [
            { type: 'required', message: 'Este campo es obligatorio' },
        ],
        document: [
            { type: 'required', message: 'Este campo es obligatorio' },
        ],
        number: [
            { type: 'pattern', message: 'Formato inválido'},
            { type: 'required', message: 'Numero de tarjeta inválido' },
        ],
        expire: [
            { type: 'required', message: 'Este campo es obligatorio' },
            { type: 'maxlength', message: 'Formato inválido'},
            { type: 'minlength', message: 'Formato inválido'},
            { type: 'pattern', message: 'Formato inválido'},

        ],
        // securityCode: [
        //     { type: 'required', message: 'Este campo es obligatorio' },
        //     { type: 'maxlength', message: 'Ingrese un numero de 3 ó 4 dígitos'},
        //     { type: 'minlength', message: 'Ingrese un numero de 3 ó 4 dígitos'},
        //     { type: 'pattern', message: 'Ingrese solo numeros'}
        // ]
    };

     /** En el formulario de email testear que pasa con la ñ y la Ñ */

    registrationForm = this.formBuilder.group({
        titular: ['', [Validators.required]],
        document: ['', [Validators.required]],
        number: ['', [Validators.required]],
        expire: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
        // securityCode: ['', [ Validators.maxLength(4), Validators.required, Validators.minLength(3), Validators.pattern('[0-9]+')]],
    });

    form = {
        titular: "",
        document: "",
        number: "",
        expire: ""
    }

    constructor(
        private route: Router,
        private formBuilder: FormBuilder,
        private navCtrl: NavController,
        public popoverController: PopoverController,
        private toast: ToastService,
        private cardsService: CreditcardsService
    ) { }

    ngOnInit() {
        this.user = this.route.getCurrentNavigation().extras.state.user;
        this.card = this.route.getCurrentNavigation().extras.state.card;
        console.log("US", this.user);
        console.log("US", this.card);
    }

    ionViewDidEnter() {
        if(this.card !== null) {
            this.form.titular = this.card.titular,
            this.form.document = this.card.document,
            this.form.number = this.card.number,
            this.form.expire = this.card.expire
        }
    }

    // Popovers
    async expirationPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: ExpirationCardCodeComponent,
            cssClass: 'addCardPopOver',
            event: ev,
            translucent: true
        });
        this.currentPopover = popover;
        return await popover.present();
    }

    // async securityPopover(ev: any) {
    //     const popover = await this.popoverController.create({
    //         component: SecurityCardCodeComponent,
    //         cssClass: 'addCardPopOver',
    //         event: ev,
    //         translucent: true
    //     });
    //     this.currentPopover = popover;
    //     return await popover.present();
    // }

    // american express popover
    async securityPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: SecurityCardCodeAmericanComponent,
            cssClass: 'addCardPopOver',
            event: ev,
            translucent: true
        });
        this.currentPopover = popover;
        return await popover.present();
    }


    inputFocus(itemName: string) {
        this.isFocus[itemName] = true;
    }
    inputBlur(itemName: string) {
        this.isFocus[itemName] = false;
    }

    get titular() {
        return this.registrationForm.get("titular");
    }
    get document() {
        return this.registrationForm.get('document');
    }
    get number() {
        return this.registrationForm.get('number');
    }
    get expire() {
        return this.registrationForm.get('expire');
    }
    // get securityCode() {
    //     return this.registrationForm.get('securityCode');
    // }

    createCard() {
        let data = {
            form: this.registrationForm.value,
            user: this.user
        }
        this.cardsService.create(data).then(res => {
            this.toast.show("Su tarjeta se ha guardado con éxito!", 2000);
            setTimeout(() => {
                this.navCtrl.back();
            }, 2150);
        }).catch(err => {
            console.log("Error-create-card", err);
            this.toast.show("Ha ocurrido un error al intentar guardar su tarjeta.", 2000);
        });
    }

    updateCard() {
        let data = {
            form: this.registrationForm.value,
            user: this.user,
            id: this.card.id
        }
        this.cardsService.update(data).then(res => {
            this.toast.show("Su tarjeta se ha modificado con éxito!", 2000);
            setTimeout(() => {
                this.navCtrl.back();
            }, 2150);
        }).catch(err => {
            console.log("Error-update-card", err);
            this.toast.show("Ha ocurrido un error al intentar modificar su tarjeta.", 2000);
        });
    }
}
