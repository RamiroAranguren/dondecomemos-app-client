import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserInterface } from 'src/app/interfaces/user';
import { restaurant } from 'src/app/interfaces/restaurant';

import { UsersService } from '../users/user.service';
import { environment } from '../../../environments/environment.prod';


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  user:UserInterface;

  favorites:any[] = [];

  constructor(
    private http: HttpClient,
    private userService: UsersService
  ) {
    this.user = this.userService.user;
  }

  protected getURL(params) {
    if(params){
      return `favorite-restaurants/?client=${params.client}`;
    } else {
      return `favorite-restaurants/`;
    }
  }

  get(){
    const params = {client: this.user.id}
    return new Promise((resolve , reject) => {
      this.http.get(`${apiUrl}${this.getURL(params)}`).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  post(resto:restaurant) {
    const body = {
      client: this.user.id,
      restaurant_id: resto.id
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${this.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}favorite-restaurants/`, body, { headers }).subscribe((response) => {
        // console.log(response);
        resolve(response);
      }, (errorResponse) => {
        console.log(errorResponse.error);
        reject(errorResponse.error);
      });
    });
  }

  delete(id:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `token ${this.user.token}`
    });
    return new Promise((resolve, reject) => {
      this.http.delete(`${apiUrl}favorite-restaurants/${id}`, { headers }).subscribe((response) => {
        // console.log(response);
        resolve(response);
      }, (errorResponse) => {
        console.log(errorResponse.error);
        reject(errorResponse.error);
      });
    });
  }

  protected process_get(response): void {
    this.favorites = response;
  }
}
