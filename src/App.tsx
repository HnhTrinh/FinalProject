import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './page/auth/index'
import RegisterPage from './page/auth/register'
import HomePage from './page/home'
import ProductListPage from './page/product-list'
import ProductDetailsPage from './page/product-list/detail'
import DefaultLayout from './layout/layout-nav'
import Checkout from './page/checkout'
import { Provider } from 'react-redux'
import { store } from './store'
import Cart from './page/cart'
import ContactPage from './page/contact'
import AdminPage from './page/admin'
import AdminCategoryPage from './page/admin/category'
import AuthInitializer from './components/AuthInitializer'
import NotFoundPage from './page/not-found'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OrderList from './page/orders'
import OrderDetail from './page/orders/order-detail'
import AdminOrdersPage from './page/admin/orders'
import AdminOrderDetail from './page/admin/orders/order-detail'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function App() {
  return (
    <Provider store={store}>
      <PayPalScriptProvider options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture"
      }}>
        <BrowserRouter>
          <AuthInitializer />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <Routes>
          {/* Public routes - chỉ truy cập khi chưa đăng nhập */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes with DefaultLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DefaultLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin/product" element={<AdminPage />} />
            <Route path="/admin/category" element={<AdminCategoryPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </PayPalScriptProvider>
    </Provider>
  )
}

export default App
