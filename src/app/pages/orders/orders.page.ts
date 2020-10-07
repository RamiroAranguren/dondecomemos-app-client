import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, AlertController, Platform } from '@ionic/angular';
import { UserInterface } from 'src/app/interfaces/user';
import { UsersService } from '../../services/users/user.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ReservationService } from '../../services/reservation/reservation.service';
import { NavigationExtras } from '@angular/router';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ToastService } from '../../services/toast/toast.service';
import { StorageService } from '../../services/storage/storage.service';

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

    loginSocial = {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        net: null,
        data: null
    };

    reservation:boolean = true;
    isGuest:boolean = false;
    notQualify:boolean = false;

    showAppleSignIn:boolean = false;

    user:UserInterface;

    spinnOrder = true;
    orders:any[] = [];
    reserves:any[] = [];

    pends_res:any[] = [];
    fin_res:any[] = [];

    pends_ord:any[] = [];
    fin_ord:any[] = [];

    pendientes:any[] = [];
    finalizados:any[] = [];

    item_ids:any[] = [];

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private platform: Platform,
        private storage: StorageService,
        private userService: UsersService,
        private orderService: OrderService,
        private reserveService: ReservationService,
        private toast: ToastService,
        private facebook: Facebook,
        private google: GooglePlus
    ) { }

    ngOnInit() {
        this.user = this.userService.user;
        this.showAppleSignIn = this.platform.is('ios');
    }

    loadData(){
        console.log("loadData()");
    }

    ionViewWillEnter(){
        this.storage.getObject("ratings").then(res => {
            if(res){
                this.item_ids = res.map(rating => {
                    return rating.related_id
                });
            }
        });

        this.spinnOrder = true;
        this.user = this.userService.user;
        try {
            this.slides.lockSwipes(true);
        } catch (error) {
            console.log(error);
        }
        if(!this.user.guest){
            //this.loaderService.display('Cargando órdenes...').then(() => {

                // LIST RESERVES
                let data = {
                    user: this.user,
                    resto: "",
                    date: "",
                    hour: ""
                };

                this.reserveService.get(data, true).then((res:any) => {
                    this.spinnOrder = false;
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
                    this.spinnOrder = false;
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
            //});

            setTimeout(() => {
                this.pendientes = this.pends_res.concat(this.pends_ord);
                this.finalizados = this.fin_res.concat(this.fin_ord);
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

    login() {
        this.navCtrl.navigateForward(['/login']);
    }

    register() {
        this.navCtrl.navigateForward(['/register']);
    }

    loginFcbk(){
        this.facebook.login(['public_profile', 'email']).then(rta => {
            if(rta.status == 'connected'){
            this.getInfo();
            }
        }).catch(error =>{
            console.error( error );
        });
    }

    getInfo(){
        this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
        .then((data:any) => {
            this.loginSocial.net = "facebook";
            this.loginSocial.data = JSON.stringify(data);
            this.loginSocial.email = data.email;
            this.loginSocial.password = data.id;
            this.loginSocial.first_name = data.first_name;
            this.loginSocial.last_name = data.last_name;
            // SE INTENTA LOGUEAR PRIMERO POR SI YA ESTA REGISTRADO
            // SINO, SE LO ENVIA A REGISTRAR
            this.userService.login(data.email, data.id, "facebook").then(res => {
            this.navCtrl.navigateRoot('/tabs/home');
            }).catch(error => {
            console.log("Error Login", error);
            let navigationExtras: NavigationExtras = {
                state: {data: this.loginSocial}};
            this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
            });
        }).catch(error =>{
            this.toast.show(`Hubo un error al intentar ingresar con Facebook`);
        });
    }

    loginGoogle(){
        this.google.login({}).then(data => {
            this.loginSocial.net = "google";
            this.loginSocial.data = JSON.stringify(data);
            this.loginSocial.email = data.email;
            this.loginSocial.password = data.userId;
            if (data.displayName && data.displayName !== "") {
            let namelong = data.displayName.split(" ");
            this.loginSocial.first_name = namelong[0];
            this.loginSocial.last_name = namelong[1];
            }
            // SE INTENTA LOGUEAR PRIMERO POR SI YA ESTA REGISTRADO
            // SINO, SE LO ENVIA A REGISTRAR
            this.userService.login(data.email, data.id, "google").then(res => {
            this.navCtrl.navigateRoot('/tabs/home');
            }).catch(error => {
            console.log("Error Login", error);
            let navigationExtras: NavigationExtras = {
                state: {data: this.loginSocial}};
            this.navCtrl.navigateForward(['/verify-number'], navigationExtras);
            });
        }).catch(err => {
            console.log(`Error ${JSON.stringify(err)}`);
            this.toast.show("Hubo un error al intentar ingresar con Google");
        });
    }

    goHome(){
        this.navCtrl.navigateRoot('/tabs/home');
    }

    loginApple() {
        console.log("loginApple");
    }

}
