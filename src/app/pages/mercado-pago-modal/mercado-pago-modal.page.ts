import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { EventsService } from '../../services/events/events.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { MercadoPagoService } from '../../services/mercado-pago/mercado-pago.service';
import { UsersService } from '../../services/users/user.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReservationService } from '../../services/reservation/reservation.service';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-mercado-pago-modal',
  templateUrl: './mercado-pago-modal.page.html',
  styleUrls: ['./mercado-pago-modal.page.scss'],
})
export class MercadoPagoModalPage implements OnInit {

  data: any;
  mpId: number;
  mpStatus:string;

  @Input() restaurantId;
  @Input() publicKey;
  @Input() info;
  @Input() tipo;
  @Input() order_type;
  @Input() data_payment;
  @Input() total;
  @Input() id;

  @ViewChild('payButton') payButton;
  @ViewChild('payForm') payForm;

  disabledPay = true;
  txtBtnPay = "PREPARANDO DATOS...";

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private storage: StorageService,
    private navCtrl: NavController,
    private loader: LoaderService,
    private reserveService: ReservationService,
    private orderService: OrderService,
    private userProvider: UsersService,
    private mercadoPagoProvider: MercadoPagoService,
    private events: EventsService,
    private toast: ToastService
  ) {

      this.events.subscribe('payment:created', (response) => {
        if (response && response.attributes.status === 'approved') {
          this.toast.show('Su pago se realizó correctamente.')
        } else {
          this.toast.show('Su pago ha sido rechazado, revise sus datos e intente nuevamente.')
        }

      });
  }

  ngOnInit(){
    this.publicKey = this.publicKey;
    this.data = {
      restaurantId: this.restaurantId,
      total: this.total,
    }

    setTimeout(() => {
      this.loader.hide();
      this.disabledPay = false;
      this.txtBtnPay = "CONFIRMAR Y PAGAR";
    }, 2800);
  }

  ngAfterViewInit(){
    this.mercadoPagoProvider.initialize(this.publicKey);
    this.mercadoPagoProvider.setCardNumberElement(this.data_payment.card.number);
    this.mercadoPagoProvider.setPayButtonElement(this.payButton);
    this.mercadoPagoProvider.setPayFormElement(this.payForm);

    this.mercadoPagoProvider.guessingPaymentMethod('keyup');
  }

  submitForm(){

    this.mercadoPagoProvider.setEmail(this.userProvider.user.email);
    this.mercadoPagoProvider.setDocNumber(this.data_payment.card.document);
    this.mercadoPagoProvider.setData(this.data);

    let form = document.getElementById("payForm");

    this.mercadoPagoProvider.doPay(form).then((mpId:any)=>{
      this.loader.display('Realizando pago...');
      this.events.publish('mp:created', {});
      this.storage.removeObject("list_order");
      setTimeout(() => {
        this.loader.hide();
        this.mpId = this.mercadoPagoProvider.mpId;
        this.mpStatus = this.mercadoPagoProvider.mpStatus;
        console.log("MP-RES", this.mpId, this.mpStatus);
        if(this.mpId === undefined || this.mpStatus === undefined){
          this.toast.show("Ha ocurrido un error con el pago, por favor verifique los datos ingresados");
          return;
        }
        if(this.tipo === 'RES'){
          this.reserveService.patch(this.userProvider.user, this.id, this.mpId, this.mpStatus).then((res:any) => {
            this.showAlert();
          });
        } else {
          this.orderService.patch(this.userProvider.user ,this.id, this.mpId, this.mpStatus).then((res:any) => {
            this.showAlertOrder(this.order_type);
          });
        }
      }, 8500);
    }).catch(err => {
      console.log("Error doPay", err);
      this.loader.hide();
    });

  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: '¡Reserva realizada con éxito!',
      subHeader: 'Recordá no llegar tarde',
      message:"Los restaurantes califican a los usuarios para ofrecer un mejor servicio.",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.storage.removeObject("list_order");
            this.navCtrl.navigateRoot('/tabs/home');
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlertOrder(order_type) {
    let options = {};

    if(order_type == 'DEL'){
      options = {
        header: 'Pedido realizado con éxito!',
        message:"Te avisaremos cuando el pedido esté en camino.",
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.storage.removeObject("list_order");
              this.navCtrl.navigateRoot('/tabs/home');
              this.modalCtrl.dismiss();
            }
          }
        ]
      }
    } else {
      options = {
        header: 'Pedido realizado con éxito!',
        subHeader: 'Recorá no llegar tarde',
        message:"Los restaurantes califican a los usuarios para ofrecer un mejor servicio.",
        backdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.storage.removeObject("list_order");
              this.navCtrl.navigateRoot('/tabs/home');
              this.modalCtrl.dismiss();
            }
          }
        ]
      }
    }
    let alert = await this.alertCtrl.create(options);
    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
