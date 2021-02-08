import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { ToastService } from '../toast/toast.service';
import { LoaderService } from '../loader/loader.service';
import { UsersService } from '../users/user.service';

const apiUrl = environment.apiUrl;

declare var Mercadopago: any;

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  doSubmit: boolean = false;
  cardNumberElement = null;
  payElement = null;
  formElement = null;
  paymentMethodId = null;
  token = null;
  email = null;
  docNumber = null;
  data:any = {};
  mpId:number;
  mpStatus:string;
  mpStatus_detail:string;

  constructor(
    public http: HttpClient,
    private userService: UsersService,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

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
    return ccNumber.replace(/[ .-]/g, '').slice(0, 6);
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
    console.log("MP-SERVICE-FORM", form);
    return new Promise((resolve, reject) => {
      Mercadopago.createToken(form, this.sdkResponseHandler.bind(this));
      resolve();
    });
  }

  sdkResponseHandler(status, response) {

    console.log("sdkResponseHandler", status, response);
    if (status != 200 && status != 201) {
      this.toast.show("Por Favor, Verifique los datos ingresados");
      this.loader.hide()
    } else {

      this.token = response.id;

      let data = {
        user:  this.userService.user,
        client: this.userService.user.email,
        restaurant: this.data.restaurantId,
        amount: this.data.total,
        description: 'Compra Donde comemos',
        payment_method: this.paymentMethodId,
        token: this.token,
      }
      let data_pay = this.sendToken(data);
      return data_pay;
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

  sendToken(body: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${body.user.token}`
    });

    console.log("BBBB", body);

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}payments/`, body, {headers}).subscribe((response: any) => {
        console.log("RES-sendToken", response, response.data.payment.attributes.id);
        this.mpId = response.data.payment.attributes.id;
        this.mpStatus = response.data.payment.attributes.status;
        this.mpStatus_detail = response.data.payment.attributes.status_detail;
        resolve(response);
      }, (errorResponse) => {
        console.log("ERR-sendToken", errorResponse);
        reject(errorResponse);
      });
    });

  }
}
