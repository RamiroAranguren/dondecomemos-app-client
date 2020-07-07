import { Component, OnInit } from '@angular/core';
import { restaurant } from 'src/app/interfaces/restaurant';
import { Router } from '@angular/router';

import * as moment from 'moment';


@Component({
    selector: 'app-book-table',
    templateUrl: './book-table.page.html',
    styleUrls: ['./book-table.page.scss'],
})
export class BookTablePage implements OnInit {
    restaurant:restaurant;

    countPeople = 1;

    slideOptionsDate = {
        slidesPerView: 4,
    }

    days_week = {
        '1': 'Lun',
        '2': 'Mar',
        '3': 'Mie',
        '4': 'Jue',
        '5': 'Vie',
        '6': 'Sab',
        '0': 'Dom',
        //{'-1': 'Feriado', range: []}
    };

    days:any[] = [];
    hours:any[] = [];

    preOrder = true;
    cumpleanos = false;
    cita = false;
    aniversario = false;
    laboral = false;
    otro = false;

    message_hours = "Seleccione una fecha ver los horarios."

    constructor(
        private route: Router
    ) { }

    ngOnInit() {
        this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;
        console.log(this.restaurant);
    }

    ionViewDidEnter(){
        let list_days = [];
        let date_start = moment();
        let date_end = moment().add(30, 'days');

        let days_allowed = this.restaurant.hours_week.map(data => data.day);

        days_allowed = days_allowed.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), []);

        console.log("days_allowed", days_allowed);

        while(date_start < date_end){
            if(days_allowed.includes(date_start.day().toString())){
                if(list_days.length < 10){
                    list_days.push({
                        day_n: date_start.day().toString(),
                        day: this.days_week[date_start.day()],
                        date: date_start.format('DD')
                    });
                }
            }
            date_start = date_start.add(1, 'days');
        }

        this.days = list_days;
        console.log("days", this.days);
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

    checkHours(item){
        console.log("DAY", item);

        let isToday = false;
        this.hours = [];
        this.message_hours = "Cargando horarios...";

        let horarios = this.restaurant.hours_week.filter(data => data.day === item.day_n);
        horarios = horarios.map(data => [data.opening_hour, data.closing_hour]);

        let date_now = moment();
        if(item.date === date_now.format("DD")){
            isToday = true;
        }

        let time_str:any;
        let fecha:any;
        let renew:any;
        let toMinute = 0;

        if(this.restaurant.renewal_time){
            time_str = this.restaurant.renewal_time.split(":");
            fecha = new Date(2020, 1, 1, Number(time_str[0]), Number(time_str[1]), 0);
            renew = moment(fecha).format("HH:mm");
            toMinute = moment.duration(renew).asMinutes();
        }

        let list_hs = [];
        horarios.forEach(data => {

            let start = moment(data[0], "HH:mm");
            let finish = moment(data[1], "HH:mm");

            if(isToday){

                if(date_now.isBetween(start, finish)) {

                    while(date_now < finish){
                        list_hs.push(date_now.format("HH:mm"));
                        start = date_now.add(15, 'minutes');
                    }

                } else if(date_now.isBefore(start)) {
                    while(start < finish){
                        list_hs.push(start.format("HH:mm"));
                        start = start.add(15, 'minutes');
                    }

                }
            } else {
                while(start < finish){
                    list_hs.push(start.format("HH:mm"));
                    start = start.add(15, 'minutes');
                }
            }
        });

        setTimeout(() => {
            list_hs = list_hs.slice(1);
            this.hours = list_hs;
            console.log("TIME", list_hs);
        }, 800);

    }

    addPeople() {

    }

    removePeople() {

    }

}
