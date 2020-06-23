import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class HoursService extends BaseService {

  hours:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
    super(http, storage)
  }

  protected getURL(id) {
    return `hours/${id}`;
  }

  protected process_get(response): void {
    this.hours = response;
  }


}
