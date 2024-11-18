import { IEnum } from "../Enum"
import { IUserResponse } from "../User/UserResponse"
import { IWorkResponse } from "../work/WorkResponse"

export interface IBudgetResponse {
    id: number
    workList: IWorkResponse[]
    deliveryForecast: Date
    customer: IUserResponse
    totalValue: number
    status: IEnum
    owner: IUserResponse
}