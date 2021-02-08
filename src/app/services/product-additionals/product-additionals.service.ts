import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductAdditionalsService {

  product_addtionals:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
  }

  protected getURL() {
    return 'products-add-reserve/';
  }

  protected process_get(response): void {
    this.product_addtionals = response;
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
      url_api = `${apiUrl}${this.getURL()}`;
      this.http.get(url_api, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  post(user, body){

    console.log("BODY-SAVE", body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}products-add-reserve/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  protected addHeaders(headers){
    //do nothing by default
  }

}
