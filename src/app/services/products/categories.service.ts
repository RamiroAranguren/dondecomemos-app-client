import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService {

  product_categories:any[] = [];

  constructor(
    public http: HttpClient,
    public storage: StorageService
  ) {
    super(http, storage)
  }

  protected getURL(id) {
    return `product-categories/?restaurant=${id}`;
  }

  protected process_get(response): void {
    this.product_categories = response;
  }

}
