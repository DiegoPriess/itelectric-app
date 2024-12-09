export interface IBudgetRequest {
    workIdList: number[]
    deliveryForecast: Date | number[];
    customerEmail: string
}