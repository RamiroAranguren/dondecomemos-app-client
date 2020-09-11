import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.page.html',
  styleUrls: ['./confirm-modal.page.scss'],
})
export class ConfirmModalPage implements OnInit {

  @Input() title;
  @Input() subtitle;
  @Input() message;

  constructor(
    private modalCtr: ModalController,
    private navCtrl: NavController,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalCtr.dismiss();
    this.storage.removeObject("list_order");
    this.navCtrl.navigateRoot('/tabs/home');
  }

}
