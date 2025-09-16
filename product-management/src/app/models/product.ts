export interface Product {
  _id?: string;   // Mongo ObjectId（后端生成）
  id: number;     // 业务唯一ID（你填写）
  name: string;
  description: string;
  price: number;
  units: number;
}