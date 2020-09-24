import { product } from "./product";

export interface restaurant {
    id: number;
    name: String;
    img: String;
    address: String;
    description: String;
    products: product[];
    max_diners: number;
    profile_picture: String;
    influence_range: number;
    delivery: boolean; // tiene o no delivery
    self_service: boolean; //retiro por el local
    reservations: boolean; // acepta o no reservas
    hours: {
        opening_hour: String,
        closing_hour: String
    }
    hours_week: any,
    renewal_time: String,
    average_time: number,
    public_key:string,
    promotions: any,
    placediscounts: any[],
    chips: any[],
    qualifications: any[],
    level:number,
    type:string,
    reviews: any[]
}

