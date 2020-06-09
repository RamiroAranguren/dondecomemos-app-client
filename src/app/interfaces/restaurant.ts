import { product } from "./product";

export interface restaurant {
    name: String;
    img: String;
    address: String;
    description: String;
    products: product[];
    id: number;
    profile_picture: String;
    influence_range: number;
    delivery: boolean;
    self_service: boolean; //retiro por el local
    hours: {
        opening_hour: String,
        closing_hour: String
    }
    renewal_time: String,
    public_key:string,
    placediscounts: any[],
    type:string
}

