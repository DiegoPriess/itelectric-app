import { IMaterial } from "./Material";

export interface IWork {
    id: number;
    name: string,
    price: number,
    materialList: IMaterial[]
}