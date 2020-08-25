import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { restaurant } from '../../interfaces/restaurant';
import { BaseService } from '../base/base.service';
import { StorageService } from '../storage/storage.service';
import { chip } from '../../interfaces/chip';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends BaseService {

  restaurants = [];
  restaurantsCopy = [];
  resturantById: restaurant;

  types = {
    level: [],
    cook: [],
    place: []
  }

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
    super(http, storage);
  }

  protected getURL(restaurantId) {
    return `restaurants/`
  }

  protected process_get(response): void {
    this.restaurants = response;
  }

  getRestaurantsByLocation(idLocation) {
    return this.restaurants.filter((resto:restaurant) => resto.influence_range === idLocation)
  }

  getRestaurantById(restaurantId) {
    return this.restaurants.filter((resto:restaurant) => resto.id === restaurantId)
  }

  getRestaurantByCity(city) {
    return this.restaurants.filter((resto:restaurant) => resto.influence_range === city.influence_range);
  }

  getRestaurantByFilters(filters, resto=null): any {

    this.restaurants = resto === null? this.restaurants : resto;

    if(filters.length <= 0) {
      return this.restaurants;
    }

    let cooks = [];
    let levels = [];
    let places = [];

    this.types = {
      level: [],
      cook: [],
      place: []
    }

    try {
      filters.map(chip => {
        if(chip.type === "level"){
          this.types.level.push(chip.id);
        }
        if(chip.type === "cook"){
          this.types.cook.push(chip.id);
        }
        if(chip.type === "place"){
          this.types.place.push(chip.name);
        }
      });
      cooks = this.types.cook;
      levels = this.types.level;
      places = this.types.place;
    } catch (error) {
      cooks = filters.cook.map((chip:chip) => chip.id);
      levels = filters.level.map((chip:chip) => chip.id);
      places = filters.place.map((chip:chip) => chip.id);
    }

    let result_cook = this.getRestoForCook(this.restaurants, cooks);
    let result_level = this.getRestoForLevel(result_cook, levels);
    let result_place = this.getRestoForPlace(result_level, places);

    let result_end = result_place;

    result_end = result_end.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), []);
    return result_end;
  }

  getRestoForCook(restos:any[], cooks){
    let rest_cook = [];
    restos.forEach((resto:restaurant) => {
      let cook_ids = resto.chips.map((chip:chip) => chip.tag.id);
      cook_ids.forEach(pk => {
        if(cooks.includes(pk)){
          rest_cook.push(resto);
        }
      });
    });
    if(rest_cook.length <= 0){
      return restos;
    }
    return rest_cook;
  }

  getRestoForLevel(restos:any[], levels){
    let resto_level = [];
    restos.forEach((resto:restaurant) => {
      if(levels.includes(resto.level)){
        resto_level.push(resto);
      }
    });
    if(resto_level.length <= 0){
      return restos;
    }
    return resto_level;
  }

  getRestoForPlace(restos:any[], places){
    let rest_place = [];
    restos.forEach((resto:restaurant) => {
      places.forEach(place => {
        if((place === "Delivery" || place === 2) && resto.delivery){
          rest_place.push(resto);
        }
        if((place === "Retiro por local" || place === 1) && resto.self_service){
          rest_place.push(resto);
        }
      });
    });
    if(rest_place.length <= 0){
      return restos;
    }
    return rest_place;
  }

}