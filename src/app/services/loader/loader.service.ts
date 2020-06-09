import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader: any
  constructor(private loadingController: LoadingController) {
  }

  async display(text, spinner="crescent"){
    this.loader = await this.loadingController.create({
      message: `${text}...`,
      spinner: "crescent"
    });
    await this.loader.present();
  }

  async hide(){
    return await this.loader.dismiss();
  }
}