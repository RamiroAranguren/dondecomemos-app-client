import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { LocationInterface } from 'src/app/interfaces/location';
import { BaseService } from '../base/base.service';
import { StorageService } from '../storage/storage.service';
import {UserInterface} from "../../interfaces/user";
import {environment} from "../../../environments/environment.prod";

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseService {

  currentLocation: LocationInterface
  locations = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
    super(http, storage);
  }

  protected getURL(restaurantId){
    return `locations/`
  }

  protected process_get(response):void {
    this.locations = response;
  }

  getLocations() {
    return this.locations;
  }

  getCurrentLocation() {
    return this.currentLocation
  }

  storeCurrentLocation(location: LocationInterface) {
    return this.currentLocation = location
  }

  removeCurrentLocation() {
    delete this.currentLocation
  }


  // headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
}