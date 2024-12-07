import axios from "axios";
import axiosInstance from "../api/inteceptor";
import { IProductData } from "../types/product.type";

export const getProductsService = () => {
  return axios.get(`${import.meta.env.VITE_API_API_URL as string}/products`)
}

export const getProductById = (id: string) => {
  return axios.get(`${import.meta.env.VITE_API_API_URL as string}/products/${id}`)
}

export const createProductService = (data: IProductData) => {
  return axiosInstance.post('/products', data)
}
