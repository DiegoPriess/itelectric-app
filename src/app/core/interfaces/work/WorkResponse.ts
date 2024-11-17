import { IMaterial } from "../../models/Material"

export interface IWorkResponse {
    id: number
    name: string
    price: number
    materialList: IMaterial[]
}