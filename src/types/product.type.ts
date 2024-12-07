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