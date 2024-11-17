import { IEnum } from "../interfaces/Enum";
import { IUserResponse } from "../interfaces/User/UserResponse";
import { IWork } from "./Work";

export interface IBudget {
    id: number
    workList: IWork[]
    customer: IUserResponse
    deliveryForecast: Date | number[];
    totalValue: number
    status: IEnum
}