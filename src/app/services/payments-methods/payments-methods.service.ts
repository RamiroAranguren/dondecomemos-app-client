import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsMethodsService extends BaseService {

  payment_methods:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
    super(http, storage)
  }

  protected getURL(id) {
    return `payment-methods/${id}`;
  }

  protected process_get(response): void {
    this.payment_methods = response;
  }


}
