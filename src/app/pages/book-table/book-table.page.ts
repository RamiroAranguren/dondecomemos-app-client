import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-table',
    templateUrl: './book-table.page.html',
    styleUrls: ['./book-table.page.scss'],
})
export class BookTablePage implements OnInit {
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
    preOrderAnswer(answ: boolean) {
        answ ? this.preOrder = true : this.preOrder = false;
    }
    check(item :string){
        item == "cumpleanos" ? this.cumpleanos = true : this.cumpleanos = false;
        item == "cita" ? this.cita = true : this.cita = false;
        item == "aniversario" ? this.aniversario = true : this.aniversario = false;
        item == "laboral" ? this.laboral = true : this.laboral = false;
        item == "otro" ? this.otro = true : this.otro = false;
    }

}
