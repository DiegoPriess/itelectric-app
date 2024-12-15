import { IBulkMaterialRequest } from "./BulkMaterialRequest"

export interface IWorkRequest {
  name: string
  laborPrice: number
  materialList: IBulkMaterialRequest[]
}