import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations:any[] = [];

  constructor(public http: HttpClient) {
  }

  protected getURL(data) {
    return `reservations/?restaurant=${data.resto.id}&date=${data.date}&hour=${data.hour}`;
  }

  protected getURLUser() {
    return 'reservations/by_user/';
  }

  protected process_get(response): void {
    this.reservations = response;
  }

  get(params:any, url=false){
    let url_api = "";
    let data = {
      user: params.user,
      resto: params.resto,
      date: params.date,
      hour: params.hour
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
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
      diners: data.diners,
      reservation_date: data.reservation_date,
      reservation_hour: data.reservation_hour,
      comments: data.comments,
      motive: data.motive,
      products: data.products,
      menus: data.menus,
      price_total: data.price_total,
      discount: data.discount
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}reservations/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  cancel(data){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve , reject) => {
      this.http.put(`${apiUrl}reservations/${data.id}/cancel/`, null, { headers }).subscribe((response:any) => {
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
      'Authorization': `bearer ${user.token}`
    });

    let body = {mp_id: data, mp_status: status};

    return new Promise((resolve , reject) => {
      this.http.patch(`${apiUrl}reservations/${id}/`, body, { headers }).subscribe((response:any) => {
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
