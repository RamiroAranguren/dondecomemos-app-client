import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment.prod';
import { UserInterface } from '../../interfaces/user';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private headerOptions = {};
  private user:UserInterface = null;

  constructor(
    public http: HttpClient,
    public storage) {

  }

  getUserStore() {
    return this.storage.getUser().then((userStore:UserInterface) => {
      return userStore;
    });
  }

  get(params={}){
    return this._fetch(params)
  }

  protected _fetch(params){

    const headers = new HttpHeaders()
    this.addHeaders(headers);

    return new Promise((resolve , reject) => {
      console.log(`${apiUrl}${this.getURL(params)}`);
      this.http.get(`${apiUrl}${this.getURL(params)}`, { headers }).subscribe((response:any) => {
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

  protected process_get(response):void{
    //do nothing by default
  }

  protected getURL(params){
    throw new Error("Method not implemented.");
  }
}