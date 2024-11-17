export interface IBudgetRequest {
    id: number
    workIdList: number[]
    deliveryForecast: Date | number[];
    customerEmail: string
}