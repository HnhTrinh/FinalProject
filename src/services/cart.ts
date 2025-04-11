import axiosInstance from "../api/inteceptor"

// Thêm sản phẩm vào giỏ hàng
export const addToCartService = (values: { productId: string, quantity: number }) => {
  return axiosInstance.post('/cart', values)
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemService = (values: { productId: string, quantity: number }) => {
  return axiosInstance.put('/cart', values)
}

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItemService = (productId: string) => {
  return axiosInstance.delete('/cart', { data: { productId } })
}

// Lấy tất cả sản phẩm trong giỏ hàng
export const getCartService = () => {
  return axiosInstance.get('/cart')
}