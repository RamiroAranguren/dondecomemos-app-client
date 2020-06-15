import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { StorageService } from '../storage/storage.service';
import { BaseService } from '../base/base.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChipService {

  chips = [];
  // chipId: restaurant;

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  protected process_get(response): void {
    this.chips = response;
  }

  getChipById(id) {
    return this.chips.filter((chip) => chip.id == id)
  }

  get(){

    const headers = new HttpHeaders();

    return new Promise((resolve , reject) => {
      this.http.get(`${apiUrl}chips/`, { headers }).subscribe((response:any) => {
        this.process_get(response)
        resolve(response)
      }),( err => {
        reject(err);
      });
    });

  }

}
