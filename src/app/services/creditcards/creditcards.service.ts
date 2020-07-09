import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment.prod';
import { UserInterface } from '../../interfaces/user';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CreditcardsService {

  private headerOptions = {};
  private user:UserInterface = null;

  cards:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
  }

  getUserStore() {
    return this.storage.getObject("user").then((userStore:UserInterface) => {
      return userStore;
    });
  }

  get(user){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${user.token}`
    });

    return new Promise((resolve , reject) => {
      this.http.get(`${apiUrl}${this.getURL(user.id)}`, { headers }).subscribe((response:any) => {
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

  protected getURL(id) {
    return `creditcards/?client=${id}`;
  }

  protected process_get(response): void {
    this.cards = response;
  }

  create(data){
    const body = {
      titular: data.form.titular,
      document: data.form.document,
      number: data.form.number,
      expire: data.form.expire,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}creditcards/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  update(data) {
    const body = {
      titular: data.form.titular,
      document: data.form.document,
      number: data.form.number,
      expire: data.form.expire,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.put(`${apiUrl}creditcards/${data.id}/`, body, { headers }).subscribe((response: any) => {
          resolve(response);
        }, (errorResponse) => {
          reject(errorResponse.error);
        })
    });
  }

}
