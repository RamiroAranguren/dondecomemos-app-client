import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment.prod';

const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class QualifyService {

  orders:any[] = [];
  user:any;

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
    this.storage.getObject('user').then((res:any) => {
      this.user = res;
    });
  }

  protected getURLQualify(data) {
    return `qualifications/?restaurant=${data.resto.id}&from=${data.date.from}&to=${data.date.to}&type=${data.type}`;
  }

  protected getURLUserQualify() {
    return 'qualifications/by_user/';
  }

  protected getURLUserReviews(id) {
    return `reviews/?user=${id}`;
  }

  protected getURLRestoReviews(id) {
    return `reviews/?restaurant=${id}`;
  }

  protected process_get(response): void {
    this.orders = response;
  }

  getQualify(params:any, url=false){
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
      'Authorization': `bearer ${params.user.token}`
    });

    return new Promise((resolve , reject) => {

      if(url === false){
        url_api = `${apiUrl}${this.getURLQualify(data)}`;
      } else {
        url_api = `${apiUrl}${this.getURLUserQualify()}`;
      }
      console.log("URL-GET-QUALIFY", url_api);
      this.http.get(url_api, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  saveQualify(data){
    const body = {
        related_id: data.related_id,
        score: data.score,
        restaurant: data.restaurant,
        related_type: data.related_type,
        score_category_id: data.score_category_id
    };

    console.log("BODY-SAVE", body);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}qualifications/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  saveReview(data){
    const body = {
      restaurant: data.restaurant,
      user_id: data.user.id,
      message: data.message
    };

    console.log("DATA-BODY-REVIEW", body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${apiUrl}reviews/`, body, {headers}).subscribe((response: any) => {
        resolve(response);
      }, (errorResponse) => {
        reject(errorResponse);
      })
    })
  }

  getUserReviews(data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve , reject) => {
      this.http.get(`${apiUrl}${this.getURLUserReviews(data.user.id)}`, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });
  }

  getRestoReviews(data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `bearer ${data.user.token}`
    });

    return new Promise((resolve , reject) => {
      this.http.get(`${apiUrl}${this.getURLRestoReviews(data.restaurant.id)}`, { headers }).subscribe((response:any) => {
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
