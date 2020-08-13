import { Injectable } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UsersService } from '../../services/users/user.service';
import { environment } from '../../../environments/environment.prod';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';

const apiUrl = environment.apiUrl;


@Injectable()
export class MercadoPagoProvider {

  doSubmit: boolean = false;
  cardNumberElement = null;
  payElement = null;
  formElement = null;
  paymentMethodId = null;
  token = null;
  email = null;
  docNumber = null;
  data: any = {};

  constructor(
    public http: HttpClient,
    private events: EventsService,
    public userProvider: UsersService,
    private loader: LoaderService,
    private toaster: ToastService, ) {
  }

  initialize(publishableKey: string) {
    Mercadopago.setPublishableKey(publishableKey);
    Mercadopago.getIdentificationTypes();
  }


  setCardNumberElement(element) {
    this.cardNumberElement = element;
  }

  setPayButtonElement(element) {
    this.payElement = element;
  }

  setPayFormElement(formElement) {
    this.formElement = formElement;
  }


  getBin() {
    var ccNumber: any = this.cardNumberElement;
    return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
  }

  guessingPaymentMethod(eventType: string) {
    let bin = this.getBin();

    if (eventType == "keyup") {
      if (bin.length >= 6) {
        Mercadopago.getPaymentMethod({
          "bin": bin
        }, this.setPaymentMethodInfo.bind(this));
      }
    } else {
      setTimeout(() => {

        if (bin.length >= 6) {

          Mercadopago.getPaymentMethod({
            "bin": bin
          }, this.setPaymentMethodInfo.bind(this));
        }
      }, 100);
    }
  }

  setPaymentMethodInfo(status, response) {
    if (status == 200) {
      let form: HTMLElement = this.formElement;

      if (this.paymentMethodId == null) {
        try {
          this.paymentMethodId = response[0].id;
        } catch (error) {
          console.log(error);
        }
      } else {
        this.paymentMethodId = response[0].id;
      }
    }
  }

  doPay(form) {
    return new Promise((resolve, reject) => {
      Mercadopago.createToken(form, this.sdkResponseHandler.bind(this)); 
      resolve();
    })
  }

  sdkResponseHandler(status, response) {
    if (status != 200 && status != 201) {
      this.toaster.show("Por Favor, Verifique los datos ingresados");
      this.loader.hide()
    } else {

      this.token = response.id;

      let payload = {
        client: this.email,
        restaurant: this.data.restaurantId,
        amount: this.data.total,
        description: 'Compra Donde comemos',
        payment_method: this.paymentMethodId,
        token: this.token,
      }

      return this.sendToken(payload);
    }
  }

  setEmail(email) {
    this.email = email;
  }

  setDocNumber(docNumber) {
    this.docNumber = docNumber;

  }

  setData(data: any) {
    this.data = data;
  }

  sendToken(payload: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${this.userProvider.user.token}`
    });

    let promise = new Promise((resolve, reject) => {

      this.http.post(`${apiUrl}payments/`, payload, { headers }).subscribe((response: any) => {
          this.loader.hide();
          let body = JSON.parse(response._body)
          this.events.publish('payment:created', {data: body.data.payment})
          resolve(response);
        }, err => {
          this.loader.hide()
          console.log(err);
          this.toaster.show("Algo salio mal...")
        }
        );
    }
    );

    return promise;

  }
}
