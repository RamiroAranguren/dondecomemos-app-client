import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { restaurant } from 'src/app/interfaces/restaurant';
import { UserInterface } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users/user.service';
import { PopoverController, NavController, AlertController } from '@ionic/angular';
import { CreditcardsService } from '../../services/creditcards/creditcards.service';
import { CreditCardListComponent } from '../../components/credit-card-list/credit-card-list.component';
import { ReservationService } from '../../services/reservation/reservation.service';

import * as moment from 'moment';
import { ReserveInfoComponent } from '../../components/reserve/reserve-info/reserve-info.component';
import { ToastService } from '../../services/toast/toast.service';
import { OrderService } from '../../services/order/order.service';

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

    inactiveFinalizar = false;

    slideOptionsDate = {
        slidesPerView: 4,
    };

    days:any[] = [];
    hours:any[] = [];

    countPeople = 0;
    occupied = 0;
    availability = 0;

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
        motive: "",
        address: "",
        expected_payment: 0,
        waiting_time: 0
    };

    deactiveNextStep = true;

    restaurant:restaurant;
    user:UserInterface;
    orders:any[] = [];
    data_order:any;

    type:string;

    list_cards:any[] = [];

    price_total = 0;

    data_payment = {
      card: null,
      code: null
    }

    constructor(
        private route: Router,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private popOver: PopoverController,
        private popOC: PopoverController,
        private popOC2: PopoverController,
        private toast: ToastService,
        private userService: UsersService,
        private storage: StorageService,
        private cardsService: CreditcardsService,
        private reserveService: ReservationService,
        private orderService: OrderService
    ) { }

    ngOnInit() {
        this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;
        this.data_order = this.route.getCurrentNavigation().extras.state.data;
        this.user = this.userService.user;
        this.type = this.route.getCurrentNavigation().extras.state.type;

        console.log("DATA_ORDER", this.data_order);
        if(this.type === undefined){
          this.type = "ORDER";
        }

        console.log("TYPE", this.type);
    }

    ionViewDidEnter(){

        this.cardsService.get(this.user).then((res:any) => {
            this.list_cards = res;
          }).catch(err => {
            console.log("Error get cards", err);
          })

        setTimeout(() => {
          this.storage.getObject("list_order").then(res => {
              console.log("ORD", res);
            if(res){
              this.orders = res.filter(ord => (ord.restaurant === this.restaurant.id && ord.user.id === this.user.id));
              let prices_order = [];
              this.orders.forEach(order => {

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
              });
              if(prices_order.length > 0){
                this.price_total = prices_order.reduce((prev, curr) => prev + curr);
              }
            }
          });
        }, 800);
    }

    check(item: string) {
        item == "comer" ? this.comer = true : this.comer = false;
        item == "delivery" ? this.delivery = true : this.delivery = false;
        item == "retirar" ? this.retirar = true : this.retirar = false;

        this.option_select.hs = "";
        this.option_select.address = "";
    }

    changeExpression() {
        this.expression = false;
        if(this.comer){
          this.uploadDays();
        }
        if(this.delivery || this.retirar){
          this.checkHoursOrder();
        }
    }

    changedAddress(ev){
      console.log(ev.detail.value);
      this.option_select.address = ev.detail.value;

      console.log(this.option_select.hs, this.option_select.address);
      this.inactiveFinalizar = this.option_select.hs !== '' && this.option_select.address !== '';
    }

    payNow(resp: boolean) {
        this.payPlace = resp
    }

    checkReason(item :string){
        item == "Cumpleaños" ? this.cumpleanos = true : this.cumpleanos = false;
        item == "Cita" ? this.cita = true : this.cita = false;
        item == "Aniversario" ? this.aniversario = true : this.aniversario = false;
        item == "Laboral" ? this.laboral = true : this.laboral = false;
        item == "Otro" ? this.otro = true : this.otro = false;

        this.option_select.motive = item;
    }

    backToViewOrder(){
        this.expression = true;
    }

    async presentPopover(resp:any, ev:any) {
        this.payNow(resp);

        const myCards = await this.popOC2.create({
          component: CreditCardListComponent,
          cssClass: 'cardsPopover',
          event: ev,
          translucent: true,
          componentProps: {
            user: this.user,
            cards: this.list_cards
          }
        });

        await myCards.present();

        const { data } = await myCards.onDidDismiss();
        if(data !== undefined){
          this.data_payment.card = data.card;
          this.data_payment.code = data.code;
        }
        await this.popOC.dismiss();
    }

    uploadDays(){
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

  checkHoursOrder(){

      let controlResto = false;

      let now = moment();

      console.log("DAY", now);

      this.option_select.date = now.format('YYYY-MM-DD');

      let isToday = true;
      this.hours = [];
      this.message_hours = "Cargando horarios...";

      let horarios = this.restaurant.hours_week.filter(data => data.day === now.day().toString());
      horarios = horarios.map(data => [data.opening_hour, data.closing_hour]);

      let date_now = moment();

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

      console.log("option_select.hs", this.option_select.hs);
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

          if(this.restaurant.max_diners > currently_occupied) {
              let reserve_people = currently_occupied + this.countPeople;

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

  goToPaymentReserve(){
    console.log("Payment data", this.data_payment);
    console.log("Order data", this.orders);

    let data:any;

    if(this.type === 'ORDER'){
      // console.log("OPT-1", this.option_select);
      data = {
          user: this.user,
          restaurant_id: this.restaurant.id,
          diners: this.countPeople,
          reservation_date: this.option_select.date,
          reservation_hour: this.option_select.hs,
          comments: this.option_select.comments,
          motive: this.option_select.motive,
          products: [],
          menus: []
      };
    } else {
      // console.log("OPT-2", this.data_order);
      data = {
          user: this.user,
          restaurant_id: this.data_order.restaurant_id,
          diners: this.data_order.diners,
          reservation_date: this.data_order.reservation_date,
          reservation_hour: this.data_order.reservation_hour,
          comments: this.data_order.comments,
          motive: this.data_order.motive,
          products: [],
          menus: []
      };

    }

    let prods = this.orders.map(order => order.product);
    data.products = prods;

    this.reserveService.post(data).then((res:any) => {

      if(!this.payPlace){
        console.log("CALL MP");
        this.showAlert();
      } else {
        this.showAlert();
      }

    }).catch(err => {
        this.toast.show("Ha ocurrido un error al intentar guardar su reserva, por favor, vuelva a intentarlo.")
        console.log("Err save reserve with order", err);
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
            this.storage.removeObject("list_order");
            this.navCtrl.navigateRoot('/tabs/home');
          }
        }
      ]
    });
    await alert.present();
  }

  goToPaymentOrder(){
    console.log("Payment data", this.data_payment);
    console.log("Order data", this.orders);

    let data:any;

    let order_type = "LOC";

    if(this.delivery){
      order_type = "DEL";
    }

    data = {
        user: this.user,
        restaurant_id: this.restaurant.id,
        address: this.option_select.address,
        order_type: order_type,
        order_date: this.option_select.date,
        order_hour: this.option_select.hs,
        expected_payment: this.option_select.expected_payment,
        waiting_time: this.option_select.waiting_time,
        mp_id: null,
        comments: this.option_select.comments,
        products: [],
        menus: []
    };

    let prods = this.orders.map(order => order.product);
    data.products = prods;

    this.orderService.post(data).then((res:any) => {

      if(!this.payPlace){
        console.log("CALL MP");
        this.showAlertOrder();
      } else {
        this.showAlertOrder();
      }

    }).catch(err => {
        this.toast.show("Ha ocurrido un error al intentar guardar su reserva, por favor, vuelva a intentarlo.")
        console.log("Err save reserve with order", err);
    });
  }

  async showAlertOrder() {
    let alert = await this.alertCtrl.create({
      header: 'Se creó con éxito su pedido!',
      subHeader: 'Recuerde no llegar tarde',
      message:"Los restaurantes califican a los usuarios para ofrecer un mejor servicio",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.storage.removeObject("list_order");
            this.navCtrl.navigateRoot('/tabs/home');
          }
        }
      ]
    });
    await alert.present();
  }
}
