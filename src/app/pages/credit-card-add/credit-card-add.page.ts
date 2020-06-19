import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
@Component({
    selector: 'app-credit-card-add',
    templateUrl: './credit-card-add.page.html',
    styleUrls: ['./credit-card-add.page.scss'],
})
export class CreditCardAddPage implements OnInit {

    public isFocus = {
        nameFocus: false,
        dniFocus: false,
        cardFocus: false,
        expirationDateFocus: false,
        securityCodeFocus: false,
    }

    ngOnInit() {
    }
    constructor(private formBuilder: FormBuilder) { }

    inputFocus(itemName:string) {
        this.isFocus[itemName] = true;
    }
    inputBlur(itemName:string) {
        this.isFocus[itemName] = false;
    }

    get name() {
        return this.registrationForm.get("name");
    }
    get dni() {
        return this.registrationForm.get('dni');
    }
    get cardNumber() {
        return this.registrationForm.get('cardNumber');
    }
    get expirationDate() {
        return this.registrationForm.get('expirationDate');
    }
    get securityCode() {
        return this.registrationForm.get('securityCode');
    }

    public errorMessages = {
        name: [
            { type: 'required', message: 'Este campo es obligatorio' },
            { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
        ],
        dni: [
            { type: 'required', message: 'Este campo es obligatorio' },
            { type: 'pattern', message: 'Ingrese un Dni valido' }
        ],
        cardNumber: [
            { type: 'required', message: 'Este campo es obligatorio' },
            { type: 'pattern', message: 'Error: Numero de tarjeta invàlido' }
        ],
        expirationDate: [
            { type: 'required', message: 'Este campo es obligatorio' },

        ],
        securityCode: [
            { type: 'required', message: 'Este campo es obligatorio' },

        ]
    };

    /** En el formulario de email testear que pasa con la ñ y la Ñ */

    registrationForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        dni: ['', [Validators.required]],
        cardNumber: ['', [Validators.required]],
        expirationDate: ['', [Validators.required]],
        securityCode: ['', [ Validators.required,Validators.maxLength(4)]],
    });

    submit() {
        console.log(this.registrationForm.value);
    }
}
