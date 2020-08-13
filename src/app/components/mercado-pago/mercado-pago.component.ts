import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
// import { MercadoPagoProvider } from './mercado-pago.provider';
import { UsersService } from '../../services/users/user.service';
import { LoaderService } from '../../services/loader/loader.service';
import { EventsService } from '../../services/events/events.service';
import { MercadoPagoService } from '../../services/mercado-pago/mercado-pago.service';

@Component({
  selector: 'app-mercado-pago',
  templateUrl: './mercado-pago.component.html',
  styleUrls: ['./mercado-pago.component.scss'],
})
export class MercadoPagoComponent implements OnInit {

  @ViewChild('cardNumber') cardNumber:ElementRef;
  @ViewChild('payButton') payButton;
  @ViewChild('payForm') payForm;
  @ViewChild('docNumber') docNumber;
  @Input() data:any = {};
  @Input() publicKey:any;
  @Input('mpId') mpId;

  image:string = null;

  constructor(
    private userProvider: UsersService,
    private loader: LoaderService,
    private events: EventsService,
    private mercadoPagoProvider: MercadoPagoService
  ) {

    // this.image = CUSTOM_IMAGE;

  }

  ngOnInit(){}

  ngAfterViewInit(){
    this.mercadoPagoProvider.initialize(this.publicKey);
    this.mercadoPagoProvider.setCardNumberElement(this.cardNumber);
    this.mercadoPagoProvider.setPayButtonElement(this.payButton);
    this.mercadoPagoProvider.setPayFormElement(this.payForm);
  }

  submitForm(){

    this.mercadoPagoProvider.setEmail(this.userProvider.user.email);
    this.mercadoPagoProvider.setDocNumber(this.docNumber);
    this.mercadoPagoProvider.setData(this.data);

    let form = document.getElementById("payForm");
    this.loader.display('Estamos creando su pedido...')
    this.mercadoPagoProvider.doPay(form).then((mpId)=>{
      this.events.publish('mp:created', {});
      this.mpId = mpId;
      // this.viewController.dismiss(this.mpId);
      // this.orderProvider.sendMercadopagoID()
    });

  }

}