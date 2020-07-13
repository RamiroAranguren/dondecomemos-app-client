import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceItem'
})
export class PriceItemPipe implements PipeTransform {

  transform(order:any): string {
    let price_item = [];

    if(order.product.variants !== undefined){
      // CALCULAMOS PRECIO DE VARIANTE X SU CANTIDAD + ADICIONALES (SI TUVIERA) X SUS CANTIDADES
      if(order.product.variants.length > 0) {
        let prices_var = order.product.variants.map(vary => {
          return vary.price * vary.count;
        });
        price_item = price_item.concat(prices_var);
      }

      if(order.product.additionals !== undefined) {
        if(order.product.additionals.length > 0) {
          let prices_add = order.product.additionals.map(add => {
            return add.price * add.count;
          });
          price_item = price_item.concat(prices_add);
        }
      }

      price_item = price_item.concat(order.product.price);

      if(price_item.length > 0){
        price_item = price_item.reduce((prev, curr) => prev + curr);
      }

      return price_item.toString();

    } else {
      // CALCULAMOS EL PRECIO DEL PRODUCTO X CANTIDAD + ADICIONALES (SI TUVIERA) X SUS CANTIDADES
      if(order.product.additionals !== undefined) {
        if(order.product.additionals.length > 0) {
          let prices_add = order.product.additionals.map(add => {
            return add.price * add.count;
          });
          price_item = price_item.concat(prices_add);
        }
      }

      price_item = price_item.concat(order.product.price);

      if(price_item.length > 0){
        price_item = price_item.reduce((prev, curr) => prev + curr);
      }

      return price_item.toString();
    }
  }

}
