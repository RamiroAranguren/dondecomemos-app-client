import { restaurant } from "./restaurant";
import { item } from './item';

export interface order {
    id: number,
    restaurant: restaurant,
    order_hour: any,
    client: any,
    address: String,
    phone_nbr: String,
    expected_payment: number,
    comments: string,
    order_type: string,
    products: orderitem[]
    menus: orderitem[],
    price_final: number
}

interface orderitem {
    id: number,
    item: item,
    amount: number
}