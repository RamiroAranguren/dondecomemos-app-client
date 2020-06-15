import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { FilterModalPage } from '../filter-modal/filter-modal.page';

import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocationService } from '../../services/location/location.service';
import { StorageService } from '../../services/storage/storage.service';

import { restaurant } from '../../interfaces/restaurant';
import { LocationInterface } from '../../interfaces/location';


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
  // detecta si hay que aplicar estilo o no al icono de filtro
  filterColor = '';

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

  constructor(
    public modalCtrl: ModalController,
    public restaurantService: RestaurantService,
    public alertCtrl: AlertController,
    public locationService: LocationService,
    private loaderService: LoaderService,
    private storage: StorageService
  ) {

  }

  ionViewWillEnter() {

  }

  getType() {
    return "restaurant"
  }

  ngOnInit() {
    this.loaderService.display('Cargando listado...').then(() => {
      this.restaurantService.get().then((res:any) => {

        this.restaurants = res;
        console.log(this.restaurants);
        this.restaurantsCopy = res;
        this.loaderService.hide();
      });
    });

    this.storage.getObject("locations").then(locations => {
      this.locations = locations;
      if(!locations){
        this.locationService.get().then((locations:any) => {
          this.storage.addObject("locations", locations);
          this.locations = locations;
        });
      }
      this.locations.filter((location:LocationInterface) => {
        this.dict_locations[location.id] = location.name;
      });
      console.log("INIT", this.dict_locations);
    }).catch(error => {
      console.log("error locations");
    });
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
      this.filterColor = '';
    }

    this.resultSearchCity = Array.from(
      new Set(this.resultSearchCity.map(res => res.influence_range)))
      .map(influ => {
        console.log(this.resultSearchCity.filter(city => city.influence_range === influ), influ);
        return {
          influence_range: influ,
          name: this.resultSearchCity.find(city => city.influence_range === influ).name,
          count: this.restaurants.filter(resto => resto.influence_range === influ).length,
          type: "city"
        }
      });
    this.resultSearchResto = this.resultSearchResto.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])

    console.log(this.resultSearchCity);
    this.resultSearch = this.resultSearchCity.concat(this.resultSearchResto);

  }

  onCancel() {
    this.valueSearch = "";
    this.searchChange = false;
    this.filterColor = '';
    this.restaurants = this.restaurantsCopy
  }

  selectResult (item) {
    this.valueSearch = item.name;
    this.searchChange = false;
    this.filterColor = 'btn-dc';
    if (item.type === 'city'){
      this.restaurants =  this.restaurantService.getRestaurantByCity(item);
    } else {
      this.restaurants =  this.restaurantService.getRestaurantById(item.id)
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

    this.chips = data.filters[0].place.concat(data.filters[0].cook).concat(data.filters[0].level);

    if(this.chips.length > 0) {
      this.filterColor = 'btn-dc';
      let resulServiceFilters = this.restaurantService.getRestaurantByFilters(data.filters[0]);
      this.restaurants = resulServiceFilters;
    } else {
      this.filterColor = '';
    }
  }

  removeChip(data:any) {
    this.chips = this.chips.filter(chip => {
      if(chip.type !== data.type){
        return chip;
      } else {
        if(chip.id !== data.id){
          return chip;
        }
      }
    });

    let resulServiceFilters = this.restaurantService.getRestaurantByFilters(this.chips);
    this.restaurants = resulServiceFilters;

    if(this.chips.length <= 0) {
      this.filterColor = '';
    }
  }
}
