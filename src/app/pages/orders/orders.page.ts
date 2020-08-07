import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, AlertController } from '@ionic/angular';
import { UserInterface } from 'src/app/interfaces/user';
import { UsersService } from '../../services/users/user.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ReservationService } from '../../services/reservation/reservation.service';
import { LoaderService } from '../../services/loader/loader.service';
import { NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    @ViewChild(IonSlides) slides: IonSlides;
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };
    reservation:boolean = true;
    isGuest:boolean = false;

    user:UserInterface;

    orders:any[] = [];
    reserves:any[] = [];

    pends_res:any[] = [];
    fin_res:any[] = [];

    pends_ord:any[] = [];
    fin_ord:any[] = [];

    pendientes:any[] = [];
    finalizados:any[] = [];

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loaderService: LoaderService,
        private userService: UsersService,
        private orderService: OrderService,
        private reserveService: ReservationService
    ) { }

    ngOnInit() {
        this.user = this.userService.user;
    }

    loadData(){
        console.log("loadData()");
    }

    ionViewWillEnter(){
        this.user = this.userService.user;
        this.slides.lockSwipes(true);
        if(!this.user.guest){
            this.loaderService.display('Cargando órdenes...').then(() => {

                // LIST RESERVES
                let data = {
                    user: this.user,
                    resto: "",
                    date: "",
                    hour: ""
                };

                this.reserveService.get(data, true).then((res:any) => {
                    if(res.length > 0){
                        let pends = res.filter(reserve => reserve.status === "IN_PROGRESS");
                        this.pends_res = pends.map(res => {
                            return {
                                id: res.id,
                                type: "RESERVE",
                                date: res.reservation_date,
                                hour: res.reservation_hour,
                                restaurant: res.restaurant,
                                client: res.client,
                                orders: res.orders,
                                order_type: "RES",
                                diners: res.diners
                            }
                        });
                        let ends = res.filter(reserve => reserve.status === "FINALIZE");
                        this.fin_res = ends.map(res => {
                            return {
                                id: res.id,
                                type: "RESERVE",
                                date: res.reservation_date,
                                hour: res.reservation_hour,
                                restaurant: res.restaurant,
                                client: res.client,
                                orders: res.orders,
                                order_type: "RES",
                                diners: res.diners
                            }
                        });
                    }

                }).catch(err => {
                    console.log("Error in list orders", err);
                });

                // LIST ORDERS
                let dataOrders = {
                    user: this.user,
                    resto: "",
                    date: {
                        from: "",
                        to: ""
                    },
                    type: ""
                };
                this.orderService.get(dataOrders, true).then((ord:any) => {
                    if(ord.length > 0){
                        this.orders = ord;
                        let pends = this.orders.filter(order => order.status === "IN_PROGRESS");
                        this.pends_ord = pends.map(ord => {
                            return {
                                id: ord.id,
                                type: "ORDER",
                                date: ord.order_date,
                                hour: ord.order_hour,
                                restaurant: ord.restaurant,
                                client: ord.client,
                                orders: ord.orders,
                                order_type: ord.order_type,
                                diners: 0
                            }
                        });
                        let ends = this.orders.filter(order => order.status === "FINALIZE");
                        this.fin_ord = ends.map(ord => {
                            return {
                                id: ord.id,
                                type: "ORDER",
                                date: ord.order_date,
                                hour: ord.order_hour,
                                restaurant: ord.restaurant,
                                client: ord.client,
                                orders: ord.orders,
                                order_type: ord.order_type,
                                diners: 0
                            }
                        });
                    }

                }).catch(err => {
                    console.log("Error in list orders", err);
                });
            });

            setTimeout(() => {
                this.pendientes = this.pends_res.concat(this.pends_ord);
                this.finalizados = this.fin_res.concat(this.fin_ord);
                this.loaderService.hide();
            }, 2500);
        }

    }

    // ionViewDidEnter(){
    //     this.slides.lockSwipes(true);
    // }

    next() {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
    }

    back() {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
    }

    goToRate(item:any) {
        let params: NavigationExtras = {state: {item: item, user: this.user}};
        this.navCtrl.navigateForward(['/order/rate'], params);
    }

    goToOrder(item:any){
        let params: NavigationExtras = {state: {item: item, user: this.user}};
        this.navCtrl.navigateForward(['/order/view-order'], params);
    }

    goToReserve(item:any){
        let params: NavigationExtras = {state: {item: item, user: this.user}};
        this.navCtrl.navigateForward(['/order/view-order'], params);
    }

    cancel(item:any){
        let data = {
            user: this.user,
            id: item.id
        }
        this.showAlert(item, data);

    }

    async showAlert(item, data){
        let obj = item.type === "RESERVE" ? "reserva" : "pedido";
        const alert = await this.alertCtrl.create({
            header: `Cancelar ${obj}`,
            subHeader: `¿Seguro quiere cancelar su ${obj}?`,
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        return;
                    }
                },
                {
                    text: 'Si, cancelar',
                    handler: () => {
                        if(item.type === "RESERVE") {
                            //cancel de reservas
                            this.reserveService.cancel(data).then(res => {
                                this.pendientes = this.pendientes.filter(pend => pend.id !== data.id);
                            }).catch(err => {
                                console.log("Error al cancelar reserva", err);
                            });
                        } else {
                            //cancel de ordenes
                            this.orderService.cancel(data).then(res => {
                                this.pendientes = this.pendientes.filter(pend => pend.id !== data.id);
                            }).catch(err => {
                                console.log("Error al cancelar orden", err);
                            });
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

}
