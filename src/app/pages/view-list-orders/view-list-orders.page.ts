import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-view-list-orders',
    templateUrl: './view-list-orders.page.html',
    styleUrls: ['./view-list-orders.page.scss'],
})
export class ViewListOrdersPage implements OnInit {
    comer = true;
    delivery = false;
    retirar = false;
    expression = true;
    payPlace = true;

    slideOptionsDate = {
        slidesPerView: 4,
    }
    days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    hours = ['14:00', '15:00', '16:20', '17:30', '19:30'];
    preOrder = true;
    cumpleanos = false;
    cita = false;
    aniversario = false;
    laboral = false;
    otro = false;

    constructor() { }

    ngOnInit() {
    }

    check(item: string) {
        item == "comer" ? this.comer = true : this.comer = false;
        item == "delivery" ? this.delivery = true : this.delivery = false;
        item == "retirar" ? this.retirar = true : this.retirar = false;
    }
    changeExpression() {
        this.expression = false;
    }
    payNow(resp: boolean) {
        this.payPlace = resp
    }
    checkReason(item :string){
        item == "cumpleanos" ? this.cumpleanos = true : this.cumpleanos = false;
        item == "cita" ? this.cita = true : this.cita = false;
        item == "aniversario" ? this.aniversario = true : this.aniversario = false;
        item == "laboral" ? this.laboral = true : this.laboral = false;
        item == "otro" ? this.otro = true : this.otro = false;
    }
}
