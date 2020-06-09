import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastController) {

  }

  async show(message, duration = 1500, position = 'bottom') {
    const toast = await this.toast
      .create({ duration: duration, position: 'bottom', message: message });
    return toast.present();
  }

}
