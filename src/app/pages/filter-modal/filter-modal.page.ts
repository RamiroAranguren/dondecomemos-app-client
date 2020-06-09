import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  applicateFilters() {
    console.log('applicate Filters');
    this.modalCtrl.dismiss({
      filters: ['Retiro por el local', 'Delivery', '$$', '$$$', 'Argentina', 'Italiana', 'Peruana']
    });
  }

  resetFilters() {
    console.log('reset Filters');
    this.modalCtrl.dismiss({filters: []});
  }

}
