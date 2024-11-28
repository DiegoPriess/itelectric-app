import { IMaterial } from "./Material";

export interface IWork {
    id: number
    name: string
    laborPrice: number
    materialPrice: number
    materialList: IMaterial[]
}