import { IMaterial } from "./Material";

export interface IWork {
    id: number;
    name: String,
    price: Number,
    materialList: IMaterial[]
}