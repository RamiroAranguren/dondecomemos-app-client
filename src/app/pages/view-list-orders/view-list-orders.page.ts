import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { restaurant } from 'src/app/interfaces/restaurant';
import { UserInterface } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users/user.service';
import { PopoverController } from '@ionic/angular';
import { CreditcardsService } from '../../services/creditcards/creditcards.service';
import { CreditCardListComponent } from '../../components/credit-card-list/credit-card-list.component';

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

    restaurant:restaurant;
    user:UserInterface;
    orders:any[] = [];

    list_cards:any[] = [];

    price_total = 0;

    constructor(
        private route: Router,
        private popOC: PopoverController,
        private userService: UsersService,
        private storage: StorageService,
        private cardsService: CreditcardsService
    ) { }

    ngOnInit() {
        this.restaurant = this.route.getCurrentNavigation().extras.state.restaurant;
        this.user = this.userService.user;

        console.log("RESTO", this.restaurant);
        console.log("USER", this.user);
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
                prices_order = prices_order.concat(order.product.price);
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
    }

    changeExpression() {
        this.expression = false;
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
    }

    backToViewOrder(){
        this.expression = true;
    }

    async presentPopover(resp:any, ev:any) {
        this.payNow(resp);

        const myCards = await this.popOC.create({
          component: CreditCardListComponent,
          cssClass: 'cardsPopover',
          event: ev,
          translucent: true,
          componentProps: {
            user: this.user,
            cards: this.list_cards
          }
        });
        return await myCards.present();
      }
}
