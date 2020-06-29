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
    hours_week: any[],
    renewal_time: String,
    public_key:string,
    promotions: any,
    placediscounts: any[],
    chips: any[],
    qualifications: any[],
    level:number,
    type:string,
    reviews: any[]
}

