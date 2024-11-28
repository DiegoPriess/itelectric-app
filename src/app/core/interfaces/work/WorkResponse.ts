import { IMaterial } from "../../models/Material"

export interface IWorkResponse {
    id: number
    name: string
    laborPrice: number
    materialPrice: number
    materialList: IMaterial[]
}