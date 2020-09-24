import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController, Platform } from '@ionic/angular';

import { FilterModalPage } from '../filter-modal/filter-modal.page';

import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { LocationService } from '../../services/location/location.service';
import { StorageService } from '../../services/storage/storage.service';

import { restaurant } from '../../interfaces/restaurant';
import { LocationInterface } from '../../interfaces/location';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { UsersService } from '../../services/users/user.service';
import { UserInterface } from 'src/app/interfaces/user';
import { NavigationExtras } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackButtonServiceService } from 'src/app/services/back-button/back-button-service.service';
import { chip } from '../../interfaces/chip';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // Activa/Desactiva el color de fondo de la pagina
  activeDefault = false;
  // Muestra/Oculta list-item de restaurantes - list result de search-bar
  searchChange = false;

  valueSearch: string = "";

  chips: any[] = [];
  filters: any[] = [];
  // detecta si hay que aplicar estilo o no al icono de filtro
  filterColor = false;
  searchColor = false;

  icons: Array<any>;
  items: Array<any>;

  locations = [];
  dict_locations = {};
  restaurants = [];
  restaurantsCopy = [];

  result_selected:any;

  resultSearch = [];
  resultSearchResto = [];
  resultSearchCity = [];

  restaurantMap = [];
  myInputs = [];

  inputSearch: any;

  types = {
    level: [],
    cook: [],
    place: []
  }

  user: UserInterface;

  backbuttonSubscription: any;

  backButtonStatus: boolean = true;

  data_level:any[] = [];
  data_cook:any[] = [];
  data_place:any[] = [];

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    public restaurantService: RestaurantService,
    private favService: FavoritesService,
    public alertCtrl: AlertController,
    public locationService: LocationService,
    private storage: StorageService,
    private userService: UsersService,
    private appMinimize: AppMinimize,
    private platform: Platform,
    private backButtonServiceService: BackButtonServiceService,
  ) {

  }

  ngOnInit() {
    this.getStorageDataInit();
  }

  ionViewDidEnter() {
    this.backButtonServiceService.changeStatusToMinimize.subscribe((status)=>{
      this.backButtonStatus = status;
    })
    this.backbuttonSubscription = this.platform.backButton.subscribe(() => {
      if (this.backButtonStatus) {
        this.appMinimize.minimize();
      }
    });
  }

  ionViewWillLeave() {
    this.unsucribeBackButton()
  }

  unsucribeBackButton() {
    this.backbuttonSubscription.unsubscribe();
  }

  getStorageDataInit() {
    // TOMO LAS LOCACIONES SI EXISTEN EN EL STORAGE
    // SINO LO TRAIGO DESDE EL SERVICE

    this.storage.getObject("locations").then(locations => {
      this.locations = locations;
      if (!locations) {
        this.locationService.get().then((locations: any) => {
          this.storage.addObject("locations", locations);
          this.locations = locations;
          this.locations.filter((location: LocationInterface) => {
            this.dict_locations[location.id] = location.name;
          });
        });
      } else {
        this.locations.filter((location: LocationInterface) => {
          this.dict_locations[location.id] = location.name;
        });
      }

    }).catch(err => {
      console.log("error locations", err);
    });

    // SI NO ES INVITADO: TOMO LOS FAVORITOS SI EXISTEN EN EL STORAGE
    // SINO LO TRAIGO DESDE EL SERVICE
    let isGuest = this.userService.isGuestUser();
    if (!isGuest) {
      this.user = this.userService.user;
      setTimeout(() => {
        this.favService.get(this.user.id).then((favs_data: any) => {
          this.storage.addObject("favorites", favs_data);
        }).catch(error => {
          console.log("error favs", error);
        });
      }, 4500);
    }

  }

  ionViewWillEnter() {

    this.restaurantService.get().then((res: any) => {
      console.log("RES", res);
      this.restaurants = res;
      this.restaurantsCopy = [...res];
      let resto_count = this.restaurants.reduce((cont, current, index) => {
        return index + 1
      }, 0);
      let resto_delivery = this.restaurants.filter((resto:restaurant) => {
        return resto.delivery === true;
      });
      let resto_local = this.restaurants.filter((resto:restaurant) => {
        return resto.self_service === true;
      });

      this.storage.getObject("filters").then(filters_local => {
        if (filters_local) {
          this.filterColor = filters_local.length > 0;
          this.chips = filters_local;
          this.restaurants = this.restaurantService.getRestaurantByFilters(filters_local, this.restaurants);
        } else {
          this.filterColor = false;
        }
      }).catch(err => {
        console.log("Error in get local filters", err);
      });
    });
  }

  doRefresh(evento) {
    let count = 0;
    this.resultSearchResto = [];
    this.resultSearchCity = [];
    this.restaurantService.get().then((res: any) => {
      this.restaurants = res;
      this.restaurantsCopy = [...res];
      this.storage.getObject("filters").then(filters_local => {
        if (filters_local && filters_local !== undefined) {
          this.filterColor = filters_local.length > 0;
          this.chips = filters_local;
          this.restaurants = this.restaurantService.getRestaurantByFilters(filters_local, this.restaurants);
        }
      }).catch(err => {
        console.log("Error in get local filters", err);
      });
      this.restaurants.forEach((resto:restaurant) => {
        if (resto.name.toLowerCase().search(this.valueSearch.toLowerCase()) !== -1) {
          resto.type = "resto";
          this.resultSearchResto.push(resto);
          return;
        }
        let resto_city = this.dict_locations[resto.influence_range];
        if (resto_city.toLowerCase().search(this.valueSearch.toLowerCase()) !== -1) {
          resto.type = "city";
          this.resultSearchCity.push(resto);
          return;
        }
      });
      this.resultSearchResto = this.resultSearchResto.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])
      this.restaurants = this.resultSearchCity.concat(this.resultSearchResto);
      evento.target.complete();
    });
    console.log("REST", this.restaurants );
    this.getStorageDataInit();
  }

  async presentAlert() {

    this.locations.forEach((location, index) => {
      let checkedStatus = index === 0 ? true : false;
      this.myInputs.push({
        type: 'radio',
        label: location.name,
        value: location.id,
        checked: checkedStatus
      });
    });

    let alert = await this.alertCtrl.create({
      header: '¿Cuál es tu ubicación?',
      message: "Te mostraremos los más cercanos.",
      inputs: this.myInputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Aceptar',
          handler: selectedRestaurantId => {

            let location = this.locations.find(
              (location) => location.id == selectedRestaurantId);

            // GUARDAMOS LA LOCACION EN EL STORE SELECCIONADA PARA NO VOLVER A PREGUNTAR
            this.storage.addObject("location", location);

            this.locationService.storeCurrentLocation(location);
            this.filterRestaurants(location);

          }
        }
      ]
    });

    await alert.present();
  }

  filterRestaurants(location: LocationInterface) {
    //Obtengo los resaurantes por el id de la ciudad
    this.restaurants = this.restaurantService.getRestaurantsByLocation(location.id)
  }

  searchFilter(event=null) {
    this.restaurants = this.restaurantsCopy;
    this.searchColor = true;
    this.resultSearchResto = [];
    this.resultSearchCity = [];
    let count = 0;
    let val = event !== null ? event.target.value : this.valueSearch;

    this.inputSearch = val;

    if (val && val.trim() !== '' && val.length >= 1) {

      this.searchChange = true;

      this.restaurants.filter((resto: restaurant) => {

        if (resto.name.toLowerCase().search(val.toLowerCase()) !== -1) {
          resto.type = "resto";
          this.resultSearchResto.push(resto);
          return;
        }

        let resto_city = this.dict_locations[resto.influence_range];
        if (resto_city.toLowerCase().search(val.toLowerCase()) !== -1) {
          resto.type = "city";
          this.resultSearchCity.push(
            { "influence_range": resto.influence_range, "name": resto_city, "type": "city", "count": count });
          return;
        }
      });

    } else {
      this.valueSearch = "";
      this.searchChange = false;
      this.searchColor = false;
      this.filterColor = false;
      let restos = this.restaurantsCopy;
      this.storage.getObject('filters').then(res => {
        if(res){
          this.chips = res;
        }
      })
      let resulServiceFilters = this.restaurantService.getRestaurantByFilters(this.chips, restos);
      this.restaurants = resulServiceFilters;
    }

    this.resultSearchCity = Array.from(new Set(this.resultSearchCity.map(res => res.influence_range))).map(influ => {
        return {
          influence_range: influ,
          name: this.resultSearchCity.find(city => city.influence_range === influ).name,
          count: this.restaurants.filter(resto => resto.influence_range === influ).length,
          type: "city"
        }
    });
    this.resultSearchResto = this.resultSearchResto.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])
    this.resultSearch = this.resultSearchCity.concat(this.resultSearchResto);

  }

  onCancel() {
    this.valueSearch = "";
    this.searchColor = false;
    this.searchChange = false;
    this.filterColor = false;
    this.restaurants = this.restaurantsCopy
    this.searchFilter();
  }

  getChips():any[] {
    let chips_list = [];
    this.storage.getObject('filters').then(res => {
      if(res){
        chips_list = res;
      }
    });

    return chips_list;
  }

  getResultChips(restos, chips):any[] {

    let chips_level = chips.filter((chip:chip) => {
      if(chip.type === 'level'){
        return chip.id;
      }
    }).map(chip => chip.id);

    let chips_cook = chips.filter((chip:chip) => {
      if(chip.type === 'cook'){
        return chip;
      }
    }).map(chip => chip.id);

    let chips_place = chips.filter((chip:chip) => {
      if(chip.type === 'place'){
        return chip.id;
      }
    }).map(chip => chip.id);

    let resto_level;
    let resto_cook;
    let resto_place;

    if(chips_level.length > 0){
      resto_level = restos.filter((resto:restaurant) => {
        if(chips_level.includes(resto.level)){
          return resto;
        }
      });
    } else {
      resto_level = restos;
    }

    if(chips_cook.length > 0){
      let cookis = [];
      resto_level.forEach((resto:restaurant) => {
        let cook_ids = resto.chips.map((chip:chip) => chip.tag.id);
        cook_ids.forEach(id => {
          if(chips_cook.includes(id)){
            cookis.push(resto);
          }
        });
      });
      resto_cook = cookis;
    } else {
      resto_cook = resto_level;
    }

    if(chips_place.length > 0){
      resto_place = resto_cook.filter((resto:restaurant) => {
        if((chips_place.includes(2) && resto.delivery) || (chips_place.includes(1) && resto.self_service)){
          return resto;
        }
      });
    } else {
      resto_place = resto_cook;
    }

    let resultEnd = resto_place;
    resultEnd = resultEnd.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])

    return resultEnd;
  }

  selectResult(resto) {
    this.result_selected = resto;
    this.valueSearch = resto.name;
    this.searchChange = false;
    this.searchColor = true;

    // this.chips = this.getChips();

    if (resto.type === 'city') {

      let result = this.restaurantService.getRestaurantByCity(null, resto);

      if(this.chips.length > 0){
        this.restaurants = this.getResultChips(result, this.chips);
      } else {
        this.restaurants = result;
      }

    } else {
      let params: NavigationExtras = { state: { data: resto, call: 'home' } };
      this.navCtrl.navigateForward(['/restaurant/details'], params);
    }
  }

  async openFilters() {
    let modal = await this.modalCtrl.create({
      component: FilterModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    console.log("DATA-FILTERS", data);

    if (data.filters.length > 0) {
      this.chips = data.filters[0].place.concat(data.filters[0].cook).concat(data.filters[0].level);

      if (this.chips.length > 0) {
        this.storage.addObject('filters', this.chips);
        this.filterColor = true;
        if(this.result_selected !== undefined){
          let result = this.restaurantService.getRestaurantByCity(this.restaurantsCopy, this.result_selected);

          this.restaurants = this.getResultChips(result, this.chips);

        } else {
          this.restaurants = this.restaurantService.getRestaurantByFilters(data.filters[0]);
        }
      } else {
        this.filterColor = false;
      }
    } else {
      this.filterColor = false;
      this.chips = [];
      if(this.result_selected !== undefined){
        let result = this.restaurantService.getRestaurantByCity(this.restaurantsCopy, this.result_selected);
        this.restaurants = this.getResultChips(result, this.chips);
      } else {
        this.restaurants = this.restaurantsCopy;
      }
    }
  }

  removeChip(data: any) {
    this.data_level = [];
    this.data_cook = [];
    this.data_place = [];
    // remove from local store
    let filter_chip_local = this.chips.filter(chip => chip.id !== data.id);
    this.storage.addObject('filters', filter_chip_local);

    // remove from list for filter
    this.chips = this.chips.filter(chip => chip.type !== data.type || chip.id !== data.id);

    if(this.result_selected !== undefined && this.valueSearch !== ''){

      let result_searchs = this.restaurantService.getRestaurantByCity(null, this.result_selected);
      if(this.chips.length > 0){
        let result = this.restaurantService.getRestaurantByCity(this.restaurantsCopy, this.result_selected);
        this.restaurants = this.getResultChips(result, this.chips);
      } else {
        this.restaurants = result_searchs;
      }
    } else {
      let result_filters = this.restaurantService.getRestaurantByFilters(this.chips);
      this.restaurants = result_filters;
    }

    console.log("RSSTTT", this.restaurants);

    if (this.chips.length <= 0) {
      this.filterColor = false;
    }
  }
}