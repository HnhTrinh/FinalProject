export interface IUserData {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  orders?: any[];
  cartItems?: {
    product: {
      id?: string;
      _id?: string;
      name: string;
      pictureURL: string;
      feature?: string[];
      price: number;
      [key: string]: any;
    };
    quantity: number;
    [key: string]: any;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}