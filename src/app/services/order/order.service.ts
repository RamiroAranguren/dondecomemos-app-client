import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment.prod';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders:any[] = [];

  constructor(public http: HttpClient) {
  }

  protected getURL(data) {
    return `orders/?restaurant=${data.resto.id}&from=${data.date.from}&to=${data.date.to}&type=${data.type}`;
  }

  protected getURLUser() {
    return 'orders/by_user/';
  }

  protected process_get(response): void {
    this.orders = response;
  }

  get(params:any, url=false){
    let url_api = "";
    let data = {
      user: params.user,
      resto: params.resto,
      date: {
        from: params.date.from,
        to: params.date.to
      },
      type: params.type
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve , reject) => {

      if(url === false){
        url_api = `${apiUrl}${this.getURL(data)}`;
      } else {
        url_api = `${apiUrl}${this.getURLUser()}`;
      }
      this.http.get(url_api, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  post(data){
    const body = {
      client: data.user.id,
      restaurant_id: data.restaurant_id,
      address: data.address,
      order_type: data.order_type,
      order_date: data.order_date,
      order_hour: data.order_hour,
      comments: data.comments,
      expected_payment: data.expected_payment,
      waiting_time: data.waiting_time,
      mp_id: data.mp_id,
      products: data.products,
      menus: data.menus
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}orders/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  cancel(data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve , reject) => {
      this.http.put(`${apiUrl}orders/${data.id}/cancel/`, null, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  patch(user, id, data, status){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${user.token}`
    });

    let body = {mp_id: data, mp_status: status};

    return new Promise((resolve , reject) => {
      this.http.patch(`${apiUrl}orders/${id}/`, body, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  protected addHeaders(headers){
    //do nothing by default
  }

}
