import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChipService } from '../../services/chips/chip.service';
import { chip } from '../../interfaces/chip';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  chips:any[] = [];
  filters:any[] = [];

  types = {
    level: [],
    cook: [],
    place: []
  }

  constructor(
    public modalCtrl: ModalController,
    private chipService: ChipService
  ) {

  }

  ngOnInit() {
    this.chipService.get().then((res:any) => {
      this.chips = res;
    });
  }

  addChip(type:string, chip:any){
    chip.type = type;

    let element = document.getElementById(`${type}-${chip.id}`);
    let hasClassOk = this.hasClass(element, 'chip-checked');

    if(hasClassOk === true) {
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
    this.modalCtrl.dismiss({filters: [{
      level: [],
      cook: [],
      place: []
    }]});
  }

  closeFilters() {
    this.modalCtrl.dismiss({filters: this.filters});
  }

}
