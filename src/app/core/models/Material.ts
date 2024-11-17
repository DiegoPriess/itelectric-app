import { IEnum } from "../interfaces/Enum";

export interface IMaterial {
    id: number
    name: string
    price: number
    unitMeasure: IEnum,
    quantityUnitMeasure: number
}