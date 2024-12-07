import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './page/auth'
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin/product" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
