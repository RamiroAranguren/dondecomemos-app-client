import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private nativeStorage: Storage
  ) { }

  addObject(key:string, value:any) {
    this.nativeStorage.remove(key);
    this.nativeStorage.set(key, value);
  }

  removeObject(key:string) {
    return this.nativeStorage.remove(key);
  }

  getObject(key:string) {
    return this.nativeStorage.get(key);
  }
}