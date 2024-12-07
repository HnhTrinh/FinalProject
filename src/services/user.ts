import axiosInstance from "../api/inteceptor"

export const getUser = (email: string) => {
  return axiosInstance.get(`/user/${email}`)
}