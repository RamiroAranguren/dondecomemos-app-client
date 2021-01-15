import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from '../../../environments/environment.prod';
import {UserInterface} from '../../interfaces/user';
import {StorageService} from '../storage/storage.service';
import {Storage} from "@ionic/storage";
import {async} from "rxjs/internal/scheduler/async";

const apiUrl = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    private headerOptions = {};
    private user: UserInterface = null;

    constructor(
        public http: HttpClient,
        public storage: StorageService) {

    }

    getUserStore() {
        return this.storage.getObject("user").then((userStore: UserInterface) => {
            return userStore;
        });
    }

    get(params = {}) {
        return this._fetch(params)
    }

    protected _fetch(params) {
        let token: string = null;
        this.getUserStore().then(
            (user: any) => {
                token = user.token;
            }
        );

        const headers = new HttpHeaders()
        //console.log("TOKENNNNNN => " + token);
        //headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        this.addHeaders(headers);

        return new Promise((resolve, reject) => {
            this.http.get(`${apiUrl}${this.getURL(params)}`, {headers}).subscribe((response: any) => {
                this.process_get(response)
                resolve(response)
            }), (err => {
                reject(err);
            });
        });
    }

    protected addHeaders(headers) {
        //do nothing by default
        if (localStorage.getItem("token") != null){
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        }
    }

    protected process_get(response): void {
        //do nothing by default
    }

    protected getURL(params) {
        throw new Error("Method not implemented.");
    }
}