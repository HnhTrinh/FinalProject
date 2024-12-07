export interface IProductData {
  id: string;
  name: string;
  feature: string[];
  description: string;
  price: number;
  pictureURL: string;
  amountInStore: number;
  categoryId: string;  // Assuming `categoryId` is a UUID
}
export interface CartItem extends IProductData {
  quantity: number;
}