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
      console.log("POR TRY", filters, this.restaurants);
      filters.map(chip => {
        if(chip.type === "level"){
          this.types.level.push(chip.id);
        }
        if(chip.type === "cook"){
          this.types.cook.push(chip.id);
        }
        if(chip.type === "place"){
          this.types.place.push(chip.id);
        }
      });
      cooks = this.types.cook;
      levels = this.types.level;
      places = this.types.place;
    } catch (error) {
      console.log("POR CATCH", filters, this.restaurants);
      cooks = filters.cook.map((chip:chip) => chip.id);
      levels = filters.level.map((chip:chip) => chip.id);
      places = filters.place.map((chip:chip) => chip.id);
    }

    console.log("cooks", cooks);
    console.log("levels", levels);
    console.log("places", places);

    let result_cook = this.restaurants.map((resto:restaurant) => {
      let cook_ids = resto.chips.map((chip:chip) => chip.tag.id);
      let rest_cook = [];
      cook_ids.forEach(pk => {
        if(cooks.includes(pk)){
          rest_cook.push(resto);
        }
      });
      return rest_cook[0];
    });

    let result_level = this.restaurants.filter((resto:restaurant) => {
      if(levels.includes(resto.level)){
        return resto;
      }
    });

    let result_place = this.restaurants.map((resto:restaurant) => {
      let place_ids = resto.placediscounts.map(place => place.id);
      let rest_place = [];
      place_ids.forEach(pk => {
        if(places.includes(pk)){
          rest_place.push(resto);
        }
      });
      return rest_place[0];
    });

    let result_end = [];

    result_cook.filter(resto => {
      if(resto !== undefined) {
        result_end.push(resto)
      }
    });
    result_level.filter(resto => {
      if(resto !== undefined) {
        result_end.push(resto)
      }
    });
    result_place.filter(resto => {
      if(resto !== undefined) {
        result_end.push(resto)
      }
    });

    result_end = result_end.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), []);

    return result_end;
  }

}