import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';

import { FilterModalPage } from '../filter-modal/filter-modal.page';

import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocationService } from '../../services/location/location.service';
import { StorageService } from '../../services/storage/storage.service';

import { restaurant } from '../../interfaces/restaurant';
import { LocationInterface } from '../../interfaces/location';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { UsersService } from '../../services/users/user.service';
import { UserInterface } from 'src/app/interfaces/user';
import { NavigationExtras } from '@angular/router';


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

  valueSearch:string = "";

  chips:any[] = [];
  filters:any[] = [];
  // detecta si hay que aplicar estilo o no al icono de filtro
  filterColor = false;
  searchColor = false;

  icons: Array<any>;
  items: Array<any>;

  locations = [];
  dict_locations = {};
  restaurants = [];
  restaurantsCopy = [];

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

  user:UserInterface;

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    public restaurantService: RestaurantService,
    private favService: FavoritesService,
    public alertCtrl: AlertController,
    public locationService: LocationService,
    private loaderService: LoaderService,
    private storage: StorageService,
    private userService: UsersService,
  ) {

  }

  ngOnInit() {
    this.getSotrageDataInit();
  }

  getSotrageDataInit() {
    // TOMO LAS LOCACIONES SI EXISTEN EN EL STORAGE
    // SINO LO TRAIGO DESDE EL SERVICE

    this.storage.getObject("locations").then(locations => {
      this.locations = locations;
      if(!locations){
        this.locationService.get().then((locations:any) => {
          this.storage.addObject("locations", locations);
          this.locations = locations;
          this.locations.filter((location:LocationInterface) => {
            this.dict_locations[location.id] = location.name;
          });
        });
      } else {
        this.locations.filter((location:LocationInterface) => {
          this.dict_locations[location.id] = location.name;
        });
      }

    }).catch(err => {
      console.log("error locations", err);
    });

    // SI NO ES INVITADO: TOMO LOS FAVORITOS SI EXISTEN EN EL STORAGE
    // SINO LO TRAIGO DESDE EL SERVICE
    let isGuest = this.userService.isGuestUser();
    if(!isGuest){
      this.user = this.userService.user;
      setTimeout(() => {
        this.favService.get(this.user.id).then((favs_data:any) => {
          this.storage.addObject("favorites", favs_data);
        }).catch(error => {
          console.log("error favs", error);
        });
      }, 4500);
    }

  }

  ionViewWillEnter() {
    this.loaderService.display('Cargando listado...').then(() => {
      this.restaurantService.get().then((res:any) => {
        this.restaurants = res;
        this.restaurantsCopy = [...res];
        this.storage.getObject("filters").then(filters_local => {
          if(filters_local){
            this.filterColor = filters_local.length > 0;
            this.chips = filters_local;
            this.restaurants = this.restaurantService.getRestaurantByFilters(filters_local, this.restaurants);
          } else {
            this.filterColor = false;
          }
        }).catch(err => {
          console.log("Error in get local filters", err);
        });
        console.log(this.restaurants);
        this.loaderService.hide();
      });
    });
  }

  doRefresh(evento) {
    this.restaurantService.get().then((res:any) => {
      this.restaurants = res;
      this.restaurantsCopy = [...res];
      this.storage.getObject("filters").then(filters_local => {
        if(filters_local){
          this.filterColor = filters_local.length > 0;
          this.chips = filters_local;
          this.restaurants = this.restaurantService.getRestaurantByFilters(filters_local, this.restaurants);
        }
      }).catch(err => {
        console.log("Error in get local filters", err);
      });
      console.log(this.restaurants);
      evento.target.complete();
    });
    this.getSotrageDataInit();
  }

  async presentAlert() {

    this.locations.forEach((location, index) => {
      let checkedStatus =  index === 0 ? true : false;
      this.myInputs.push({
        type: 'radio',
        label: location.name,
        value: location.id,
        checked: checkedStatus
      });
    });

    let alert = await this.alertCtrl.create({
      header: '¿Cuál es tu ubicación?',
      message:"Te mostraremos los más cercanos.",
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

  searchFilter( event )  {
    this.searchColor = true;
    this.resultSearchResto = [];
    this.resultSearchCity = [];
    let count = 0;
    let val = event.target.value;

    this.inputSearch = val;

    if (val && val.trim() !== ''){

      if(val.length >= 1){

        this.searchChange = true;

        this.restaurants.filter((resto:restaurant) =>{

          if(resto.name.toLowerCase().search(val.toLowerCase()) !== -1) {
            resto.type = "resto";
            this.resultSearchResto.push(resto);
            return;
          }

          let resto_city = this.dict_locations[resto.influence_range];
          if(resto_city.toLowerCase().search(val.toLowerCase()) !== -1) {
            resto.type = "city";
            this.resultSearchCity.push(
              {"influence_range": resto.influence_range, "name": resto_city, "type": "city", "count": count});
            return;
          }
        });

      }
    } else {
      this.valueSearch = "";
      this.searchChange = false;
      this.searchColor = false;
      this.filterColor = false;
    }

    this.resultSearchCity = Array.from(
      new Set(this.resultSearchCity.map(res => res.influence_range)))
      .map(influ => {
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
  }

  selectResult (resto) {
    this.valueSearch = resto.name;
    this.searchChange = false;
    this.searchColor = true;
    if (resto.type === 'city'){
      this.restaurants =  this.restaurantService.getRestaurantByCity(resto);
    } else {
      let params: NavigationExtras = {state: {data: resto, call:'home'}};
      this.navCtrl.navigateForward(['/restaurant/details'], params);
    }
  }

  async openFilters(){
    let modal = await this.modalCtrl.create({
      component: FilterModalPage,
      backdropDismiss: false,
      keyboardClose: false,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if(data.filters.length > 0){

      this.chips = data.filters[0].place.concat(data.filters[0].cook).concat(data.filters[0].level);

      if(this.chips.length > 0) {
        this.filterColor = true;
        let save_filters_place = data.filters[0].place.map(fl => {
          return {id: fl.id, name: fl.name, type: fl.type}
        });
        let save_filters_cook = data.filters[0].cook.map(fl => {
          return {id: fl.id, name: fl.name, type: fl.type}
        });
        let save_filters_level = data.filters[0].level.map(fl => {
          return {id: fl.id, name: fl.name, type: fl.type}
        });
        this.storage.addObject('filters', save_filters_place.concat(save_filters_cook).concat(save_filters_level));
        let resulServiceFilters = this.restaurantService.getRestaurantByFilters(data.filters[0]);
        this.restaurants = resulServiceFilters;
      } else {
        this.filterColor = false;
      }
    } else {
      this.filterColor = false;
      this.chips = [];
      this.restaurants = this.restaurantsCopy;
    }
  }

  removeChip(data:any) {
    // remove from local store
    let filter_chip_local = this.chips.filter(chip => chip.id !== data.id);
    this.storage.addObject('filters', filter_chip_local);

    // remove from list for filter
    this.chips = this.chips.filter(chip => chip.type !== data.type || chip.id !== data.id);
    this.restaurants = this.restaurantService.getRestaurantByFilters(this.chips);

    if(this.chips.length <= 0) {
      this.filterColor = false;
    }
  }
}