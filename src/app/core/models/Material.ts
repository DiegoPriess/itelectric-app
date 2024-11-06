import { IEnum } from "./Enum";

export interface IMaterial {
    id: number;
    name: String,
    price: Number,
    unitMeasure: IEnum,
    quantityUnitMeasure: Number
}