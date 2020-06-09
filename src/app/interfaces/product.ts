import { item } from "./item";

export interface product extends item{
    category: category;
}

export interface category {
    name: String;
}