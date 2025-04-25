# API Endpoints

Tài liệu này liệt kê tất cả các API endpoints được sử dụng trong dự án, bao gồm cả các dịch vụ bên thứ ba như PayPal và Cloudinary.

## Backend API Endpoints

| ID | URL | Method | Params | Returns |
|----|-----|--------|--------|---------|
| 1 | `/auth/login` | POST | `{ email: string, password: string }` | `{ success: boolean, token: string, user: UserObject }` |
| 2 | `/auth/register` | POST | `{ name: string, email: string, password: string, phone: string, address: string }` | `{ success: boolean, message: string, user: UserObject }` |
| 3 | `/products` | GET | - | `{ success: boolean, data: Product[], message: string }` |
| 4 | `/products/:id` | GET | `id: string` (path param) | `{ success: boolean, data: Product, message: string }` |
| 5 | `/products` | POST | `{ name: string, price: number, description: string, feature: string[], amountInStore: number, category: string, pictureURL: string }` | `{ success: boolean, data: Product, message: string }` |
| 6 | `/products/:id` | PUT | `id: string` (path param), Product object | `{ success: boolean, data: Product, message: string }` |
| 7 | `/products/:id` | DELETE | `id: string` (path param) | `{ success: boolean, message: string }` |
| 8 | `/cart` | GET | - | `{ success: boolean, data: CartItem[], message: string }` |
| 9 | `/cart` | POST | `{ productId: string, quantity: number }` | `{ success: boolean, data: CartItem, message: string }` |
| 10 | `/cart` | PUT | `{ productId: string, quantity: number }` | `{ success: boolean, data: CartItem, message: string }` |
| 11 | `/cart` | DELETE | `{ productId: string }` (request body) | `{ success: boolean, message: string }` |
| 12 | `/orders` | GET | - | `{ success: boolean, data: Order[], message: string }` |
| 13 | `/orders/:id` | GET | `id: string` (path param) | `{ success: boolean, data: Order, message: string }` |
| 14 | `/orders` | POST | - | `{ success: boolean, data: Order, message: string }` |
| 15 | `/orders/:id/status` | PUT | `id: string` (path param), `{ status: string }` | `{ success: boolean, data: Order, message: string }` |
| 16 | `/user/:email` | GET | `email: string` (path param) | `{ success: boolean, data: User, message: string }` |
| 17 | `/user/profile` | GET | - | `{ success: boolean, data: User, message: string }` |
| 18 | `/user/profile` | PUT | `{ name: string, phone: string, address: string }` | `{ success: boolean, data: User, message: string }` |
| 19 | `/user/change-password` | PUT | `{ currentPassword: string, newPassword: string }` | `{ success: boolean, message: string }` |
| 20 | `/category` | GET | - | `{ success: boolean, data: Category[], message: string }` |
| 21 | `/category/:id` | GET | `id: string` (path param) | `{ success: boolean, data: Category, message: string }` |
| 22 | `/category` | POST | `{ name: string }` | `{ success: boolean, data: Category, message: string }` |
| 23 | `/category/:id` | PUT | `id: string` (path param), `{ name: string }` | `{ success: boolean, data: Category, message: string }` |
| 24 | `/category/:id` | DELETE | `id: string` (path param) | `{ success: boolean, message: string }` |

## Cloudinary API Endpoints

| ID | URL | Method | Params | Returns |
|----|-----|--------|--------|---------|
| 25 | `https://api.cloudinary.com/v1_1/dr55r3y3z/image/upload` | POST | FormData với `file` và `upload_preset: 'unsigned_preset'` | `{ secure_url: string, ... }` |

## PayPal API Endpoints (thông qua SDK)

| ID | URL | Method | Params | Returns |
|----|-----|--------|--------|---------|
| 26 | PayPal SDK - Create Order | - | `{ purchase_units: [{ amount: { currency_code: string, value: string } }], application_context: { shipping_preference: string } }` | Order object với ID |
| 27 | PayPal SDK - Capture Order | - | Order ID | Payment details với transaction ID |

## Mô hình dữ liệu

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  description: String,
  feature: [String],
  amountInStore: Number,
  category: { type: ObjectId, ref: 'Category' },
  pictureURL: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  _id: ObjectId,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Item
```javascript
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  productId: { type: ObjectId, ref: 'Product' },
  quantity: Number,
  productDetails: {
    _id: ObjectId,
    name: String,
    price: Number,
    pictureURL: String
  },
  productExists: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  user: {
    _id: ObjectId,
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [
    {
      product: {
        _id: ObjectId,
        name: String,
        price: Number,
        pictureURL: String
      },
      quantity: Number
    }
  ],
  totalPrice: Number,
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'completed'
  transactionId: String,
  paymentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Xác thực

Tất cả các API endpoints (ngoại trừ đăng nhập và đăng ký) đều yêu cầu xác thực bằng JWT token. Token được gửi trong header Authorization:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

JWT token chứa thông tin người dùng, bao gồm:
- `id`: ID của người dùng
- `email`: Email của người dùng
- `isAdmin`: Quyền admin của người dùng (boolean)
