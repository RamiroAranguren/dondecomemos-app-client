import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ChipService } from '../../services/chips/chip.service';
import { chip } from '../../interfaces/chip';
import { StorageService } from '../../services/storage/storage.service';
import { BackButtonServiceService } from 'src/app/services/back-button/back-button-service.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  chips:any[] = [];
  filters:any[] = [];
  pre_filters:any[] = [];

  types = {
    level: [],
    cook: [],
    place: [],
    all: []
  }

  backButtonSuscription:any;

  constructor(
    public modalCtrl: ModalController,
    private storage: StorageService,
    private chipService: ChipService,
    private backButtonServiceService: BackButtonServiceService,
    private platform: Platform,
  ) {

  }

  ngOnInit() {
    this.chipService.getTags().then((res:any) => {
      this.chips = res;
      this.storage.getObject('filters').then(res => {
        if(res){
          this.pre_filters = res;
          this.pre_filters.forEach(filter => {
            let element = document.getElementById(`${filter.type}-${filter.id}`);
            element.classList.add('chip-checked');
            if(filter.type === "level"){
              this.types.level.push(filter);
            }
            if(filter.type === "cook"){
              this.types.cook.push(filter);
            }
            if(filter.type === "place"){
              this.types.place.push(filter);
            }
            this.types.all.push(filter);
          });
        }
      }).catch(err => {
        console.log("Error read local store filters", err);
      }).catch(err => {
        console.log("Error read service tags", err);
      })
    });

  }

  ionViewDidEnter(){
    // this.backButtonServiceService.changeStatusToMinimize.emit(false);
    // this.backButtonSuscription = this.platform.backButton.subscribe(()=>{
      //this.closeFilters();
    // })
  }

  ionViewWillLeave() {
    // this.backButtonServiceService.changeStatusToMinimize.emit(true);
   }

  addChip(type:string, chip:any){
    chip.type = type;

    let element = document.getElementById(`${type}-${chip.id}`);
    let hasClassOk = this.hasClass(element, 'chip-checked');

    if(hasClassOk === true) {
      this.pre_filters = this.pre_filters.filter(filt => filt.id !== chip.id);
      this.storage.addObject('filters', this.pre_filters);
      element.classList.remove('chip-checked');
      if(type === "level"){
        this.types.level = this.types.level.filter((chipe:chip) => chipe.id !== chip.id);
      }
      if(type === "cook"){
        this.types.cook = this.types.cook.filter((chipe:chip) => chipe.id !== chip.id);
      }
      if(type === "place"){
        this.types.place = this.types.place.filter((chipe:chip) => chipe.id !== chip.id);
      }
    } else {
      element.classList.add('chip-checked');

      if(type === "level"){
        this.types.level.push(chip);
      }
      if(type === "cook"){
        this.types.cook.push(chip);
      }
      if(type === "place"){
        this.types.place.push(chip);
      }

      this.types.all.push(chip);
    }
  }

  hasClass(element, className) {
    return element.classList.contains(className);
  }

  applicateFilters() {

    this.filters.push(this.types);
    this.filters = this.filters.reduce((newTempArr, el) => (newTempArr.includes(el) ? newTempArr : [...newTempArr, el]), [])
    this.modalCtrl.dismiss({filters: this.filters});
  }

  resetFilters() {
    this.storage.removeObject('filters');
    this.modalCtrl.dismiss({filters: []});
  }

  closeFilters() {
    let types = {
      level: [],
      cook: [],
      place: [],
    }
    this.storage.getObject('filters').then(res => {
      if(res){
        res.forEach(chip => {
          if(chip.type === "level"){
            types.level.push(chip);
          }
          if(chip.type === "cook"){
            types.cook.push(chip);
          }
          if(chip.type === "place"){
            types.place.push(chip);
          }
        });
      }
    });
    this.modalCtrl.dismiss({filters: [types]});
  }

}
