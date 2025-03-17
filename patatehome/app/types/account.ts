export interface Account {
  id: number;
  hdv: number;
  level: number;
  price: number;
  imageFilename: string;
  features: string[] | string;
  status: string;
  cartCount: number;
  createdAt: number;
  updatedAt: number;
  additionalImages?: string[];
  _imgTimestamp?: number;
}
