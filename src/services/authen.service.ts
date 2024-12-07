import axios from "axios";
import { IUserData } from "../types/authen.type";

export const loginService = (data: { email: string; password: string }) => {
  return axios.post(`${import.meta.env.VITE_API_API_URL as string}/auth/login`, data)
}

export const registerService = (data: IUserData) => {
  return axios.post(`${import.meta.env.VITE_API_API_URL as string}/auth/register`, data)
}