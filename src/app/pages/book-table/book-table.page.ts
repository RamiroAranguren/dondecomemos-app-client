import { Component, OnInit } from '@angular/core';
import { restaurant } from 'src/app/interfaces/restaurant';
import { Router, NavigationExtras } from '@angular/router';

import * as moment from 'moment';
import { NavController, PopoverController, AlertController } from '@ionic/angular';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { UserInterface } from 'src/app/interfaces/user';
import { ReserveInfoComponent } from 'src/app/components/reserve/reserve-info/reserve-info.component';
import { ToastService } from '../../services/toast/toast.service';
import { StorageService } from '../../services/storage/storage.service';


@Component({
    selector: 'app-book-table',
    templateUrl: './book-table.page.html',
    styleUrls: ['./book-table.page.scss'],
})
export class BookTablePage implements OnInit {

    restaurant:restaurant;
    user:UserInterface;
    product_categories:any[] = [];

    countPeople = 0;
    occupied = 0;
    availability = 0;

    deactiveNextStep = true;

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

    message_hours = "Seleccione una fecha ver los horarios.";

    capacity:number;

    option_select = {
        date: "",
        hs:"",
        comments:"",
        motive: ""
    };

    constructor(
        private route: Router,
        private navCtrl: NavController,
        private popOver: PopoverController,
        private alertCtrl: AlertController,
        private toast: ToastService,
        private reserveService: ReservationService,
        private storage: StorageService
    ) { }

    ngOnInit() {
        this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;
        this.user = this.route.getCurrentNavigation().extras.state.user;
        this.product_categories = this.route.getCurrentNavigation().extras.state.product_categories;
        console.log(this.restaurant);
    }

    ionViewDidEnter(){
        let list_days = [];
        let date_start = moment();
        let date_end = moment().add(30, 'days');

        let days_allowed = this.restaurant.hours_week.map(data => data.day);

        days_allowed = days_allowed.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), []);

        while(date_start < date_end){
            if(days_allowed.includes(date_start.day().toString())){
                if(list_days.length < 10){
                    list_days.push({
                        day_n: date_start.day().toString(),
                        day: this.days_week[date_start.day()],
                        date: date_start.format('YYYY-MM-DD').toString()
                    });
                }
            }
            date_start = date_start.add(1, 'days');
        }

        this.days = list_days;
    }

    preOrderAnswer(answ: boolean) {
        this.preOrder = answ ? false : true;
    }

    check(item :string){
        item == "Cumpleaños" ? this.cumpleanos = true : this.cumpleanos = false;
        item == "Cita" ? this.cita = true : this.cita = false;
        item == "Aniversario" ? this.aniversario = true : this.aniversario = false;
        item == "Laboral" ? this.laboral = true : this.laboral = false;
        item == "Otro" ? this.otro = true : this.otro = false;

        this.option_select.motive = item;
    }

    checkHours(item){

        let controlResto = false;

        console.log("DAY", item);
        if(this.countPeople !== 0) {
            this.option_select.date = item.date;

            let isToday = false;
            this.hours = [];
            this.message_hours = "Cargando horarios...";

            let horarios = this.restaurant.hours_week.filter(data => data.day === item.day_n);
            horarios = horarios.map(data => [data.opening_hour, data.closing_hour]);

            let date_now = moment();
            console.log("isToday", item.date.slice(-2), date_now.format("DD"));
            if(item.date.slice(-2) === date_now.format("DD")){
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
                let finish = moment(data[1], "HH:mm").subtract(toMinute, 'minutes');

                if(isToday){

                    if(date_now.isBetween(start, finish)) {
                        controlResto = true;
                        while(date_now < finish){
                            list_hs.push(start.format("HH:mm"));
                            start = start.add(15, 'minutes');
                            date_now.add(15, 'minutes');
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

            console.log("list_hs", list_hs);

            if(controlResto){

                let date_now_init = moment();
                let evaluate = Number(date_now_init.format("mm"));
                while((evaluate%15) !== 0){
                    date_now_init.add(1, 'minutes');
                    evaluate = Number(date_now_init.format("mm"));
                }
                let index_hs = list_hs.indexOf(date_now_init.format("HH:mm"));
                list_hs = list_hs.slice(index_hs);
            }

            this.hours = list_hs.length === 1 ? list_hs: list_hs.slice(1);

            console.log("TIME", list_hs);
        } else {
            this.message_hours = "Seleccione la cantidad de personas y luego verá los horarios."
        }

    }

    selectHour(ev, hs:any){

        this.option_select.hs = hs;

        let element = document.getElementById(`option-${hs}`);

        let data = {
            user: this.user,
            resto: this.restaurant,
            date: this.option_select.date,
            hour: this.option_select.hs
        };

        let currently_occupied = 0;
        this.reserveService.get(data).then((res:any[]) => {
            console.log("RES", res);
            if(res.length > 0) {
                let diners = res.map(reserve => reserve.diners);
                currently_occupied = diners.reduce((prev:number, curr:number) => prev + curr);
                this.occupied = currently_occupied;
                this.availability = this.restaurant.max_diners - currently_occupied;
            }

            console.log("currently_occupied", currently_occupied);
            console.log("restaurant.max_diners", this.restaurant.max_diners);

            if(this.restaurant.max_diners > currently_occupied) {
                let reserve_people = currently_occupied + this.countPeople;

                console.log("reserve_people", reserve_people);

                if(reserve_people > this.restaurant.max_diners){
                    this.option_select.hs = "";
                    this.showPopOver(ev);
                    this.deactiveNextStep = true;
                    element.classList.remove('segment-button-checked');
                } else {
                    this.deactiveNextStep = false;
                }

            } else {
                this.option_select.hs = "";
                this.showPopOver(ev);
                this.deactiveNextStep = true;
                element.classList.remove('segment-button-checked');
            }
        });
    }

    hasClass(element, className) {
        return element.classList.contains(className);
    }

    async showPopOver( evento ){
        const pop = await this.popOver.create({
            component: ReserveInfoComponent,
            event: evento,
            mode: 'ios',
            componentProps:{
                availability: this.availability
            }
        });
        await pop.present();
    }

    addPeople() {
        this.hours = [];
        this.message_hours = "Seleccione una fecha ver los horarios.";
        if(this.countPeople < this.restaurant.max_diners){
            this.countPeople += 1;
        }
    }

    removePeople() {
        this.hours = [];
        this.message_hours = "Seleccione una fecha ver los horarios.";
        if(this.countPeople >= 2){
            this.countPeople -= 1;
        }
    }

    goToPreOrder(){
        let data = {
            user: this.user,
            restaurant_id: this.restaurant.id,
            diners: this.countPeople,
            reservation_date: this.option_select.date,
            reservation_hour: this.option_select.hs,
            comments: this.option_select.comments,
            motive: this.option_select.motive,
            products: [],
            menus: []
        }
        let navigationExtras: NavigationExtras = {
            state: {
                type:"RESERVE",
                restaurant: this.restaurant,
                data: data,
                product_categories: this.product_categories
            }
        };
        this.navCtrl.navigateForward(['/order/pre-order'], navigationExtras);
    }

    goToReserve(){

        let data = {
            user: this.user,
            restaurant_id: this.restaurant.id,
            diners: this.countPeople,
            reservation_date: this.option_select.date,
            reservation_hour: this.option_select.hs,
            comments: this.option_select.comments,
            motive: this.option_select.motive,
            products: [],
            menus: []
        }
        this.reserveService.post(data).then(res => {
            this.showAlert();
        }).catch(err => {
            this.toast.show("Ha ocurrido un error al intentar guardar su reserva, por favor, vuelva a intentarlo.")
        });
    }

    async showAlert() {

        let alert = await this.alertCtrl.create({
          header: 'Se creó con éxito su reserva!',
          subHeader: 'Recuerde no llegar tarde',
          message:"Los restaurantes califican a los usuarios para ofrecer un mejor servicio",
          backdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.navigateRoot('/tabs/home');
              }
            }
          ]
        });
        await alert.present();
    }

    showAlertBack() {
        this.storage.getObject("list_order").then(res => {
            let prices_order = [];
            if(res){
                let orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id === this.user.id));
                console.log("ORDERS-USER-RESTO");
                orders.forEach(order => {
                    if(order.product !== null){
                        if(order.product.variants !== undefined){
                            if(order.product.variants.length > 0) {
                                let prices_var = order.product.variants.map(vary => {
                                    return vary.price * vary.count;
                                });
                                prices_order = prices_order.concat(prices_var);
                            }
                        }

                        if(order.product.additionals !== undefined) {
                            if(order.product.additionals.length > 0) {
                                let prices_add = order.product.additionals.map(add => {
                                    return add.price * add.count;
                                });
                                prices_order = prices_order.concat(prices_add);
                            }
                        }

                        prices_order = prices_order.concat(order.product.price * order.product.count);
                    }
                    if(order.menu !== null){
                        prices_order = prices_order.concat(order.menu.real_price * 1)
                    }
                });

                console.log("Prices_order", prices_order, prices_order.length);
            }
            if(prices_order.length > 0){
                this.showAlertMSG();
            } else {
                let params: NavigationExtras = {state: {data: this.restaurant}};
                this.navCtrl.navigateForward(['/restaurant/details'], params);
            }
        });
    }

    async showAlertMSG() {
        const alert = await this.alertCtrl.create({
            header: 'Si sale perderá todos los datos de la reserva',
            buttons: [
                {
                text: 'Cancelar',
                handler: () => {
                    return;
                }
                },
                {
                text: 'Salir',
                handler: () => {
                    this.storage.getObject("list_order").then(res => {
                        if(res){
                            let orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id !== this.user.id));
                            this.storage.addObject("list_order", orders);
                        }
                    });
                    setTimeout(() => {
                        let params: NavigationExtras = {state: {data: this.restaurant}};
                        this.navCtrl.navigateForward(['/restaurant/details'], params);
                    }, 800);
                }
                }
            ]
        });

        await alert.present();
    }

}
