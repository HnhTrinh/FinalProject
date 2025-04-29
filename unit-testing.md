# Unit Testing Documentation

## Overview
This document outlines the unit testing approach for the e-commerce frontend application. The tests are designed to verify the functionality of individual components and services in isolation.

## Test Environment
- Testing Framework: Jest
- Testing Library: React Testing Library
- Mock Service: Jest Mock Functions
- Browser Environment: JSDOM

## Unit Test Cases

| Test Case Id | Description | Input | Expected Result | Actual Outcome | Pass/Fail |
|--------------|-------------|-------|----------------|----------------|-----------|
| TEST1 | User login with valid credentials | { email: 'user@example.com', password: 'password123' } | { data: { success: true, data: { user: { email: 'user@example.com', name: 'Test User', isAdmin: false }, token: 'jwt-token' } } } | { data: { success: true, data: { user: { email: 'user@example.com', name: 'Test User', isAdmin: false }, token: 'jwt-token' } } } | Pass |
| TEST2 | User login with invalid credentials | { email: 'user@example.com', password: 'wrongpassword' } | { data: { success: false, message: 'Invalid email or password' } } | { data: { success: false, message: 'Invalid email or password' } } | Pass |
| TEST3 | User registration with valid data | { name: 'New User', email: 'newuser@example.com', password: 'password123' } | { data: { success: true, message: 'User registered successfully' } } | { data: { success: true, message: 'User registered successfully' } } | Pass |
| TEST4 | Google OAuth login | { tokenId: 'google-token-123' } | { data: { success: true, data: { user: { email: 'user@gmail.com', name: 'Google User', isAdmin: false }, token: 'jwt-token' } } } | { data: { success: true, data: { user: { email: 'user@gmail.com', name: 'Google User', isAdmin: false }, token: 'jwt-token' } } } | Pass |
| TEST5 | AuthInitializer clears invalid auth data | localStorage with incomplete auth data | localStorage is cleared | localStorage is cleared | Pass |
| TEST6 | Add product to cart | { productId: '123', quantity: 2 } | { data: { success: true, message: 'Product added to cart' } } | { data: { success: true, message: 'Product added to cart' } } | Pass |
| TEST7 | Update product quantity in cart | { productId: '123', quantity: 5 } | { data: { success: true, message: 'Cart updated successfully' } } | { data: { success: true, message: 'Cart updated successfully' } } | Pass |
| TEST8 | Remove product from cart | { productId: '123' } | { data: { success: true, message: 'Product removed from cart' } } | { data: { success: true, message: 'Product removed from cart' } } | Pass |
| TEST9 | Get cart contents | No input (uses auth token) | { data: { success: true, data: { items: [{ _id: 'cart1', productId: '123', quantity: 2, productDetails: { name: 'Test Product', price: 99.99, amountInStore: 10 } }] } } } | { data: { success: true, data: { items: [{ _id: 'cart1', productId: '123', quantity: 2, productDetails: { name: 'Test Product', price: 99.99, amountInStore: 10 } }] } } } | Pass |
| TEST10 | Create order from cart | {} (empty object, uses cart data) | { data: { success: true, data: { _id: 'order123' } } } | { data: { success: true, data: { _id: 'order123' } } } | Pass |
| TEST11 | Process PayPal payment | PayPal SDK response with orderId and paymentId | Order created and user redirected to orders page | Order created and user redirected to orders page | Pass |
| TEST12 | Get user orders | No input (uses auth token) | { data: { success: true, data: [{ _id: 'order123', totalPrice: 199.98, status: 'processing', items: [...] }] } } | { data: { success: true, data: [{ _id: 'order123', totalPrice: 199.98, status: 'processing', items: [...] }] } } | Pass |
| TEST13 | Get product details | { productId: '123' } | { data: { success: true, data: { _id: '123', name: 'Test Product', price: 99.99, features: ['Feature 1', 'Feature 2'], amountInStore: 10 } } } | { data: { success: true, data: { _id: '123', name: 'Test Product', price: 99.99, features: ['Feature 1', 'Feature 2'], amountInStore: 10 } } } | Pass |
| TEST14 | Admin create product | { name: 'New Product', price: 99.99, category: 'electronics', amountInStore: 50 } | { data: { success: true, data: { _id: '456', name: 'New Product', price: 99.99, category: 'electronics', amountInStore: 50 } } } | { data: { success: true, data: { _id: '456', name: 'New Product', price: 99.99, category: 'electronics', amountInStore: 50 } } } | Pass |
| TEST15 | Admin update product | { id: '456', name: 'Updated Product', price: 89.99 } | { data: { success: true, message: 'Product updated successfully' } } | { data: { success: true, message: 'Product updated successfully' } } | Pass |
| TEST16 | Admin delete product | { id: '456' } | { data: { success: true, message: 'Product deleted successfully' } } | { data: { success: true, message: 'Product deleted successfully' } } | Pass |
| TEST17 | Admin update order status | { orderId: 'order123', status: 'shipped' } | { data: { success: true, message: 'Order status updated successfully' } } | { data: { success: true, message: 'Order status updated successfully' } } | Pass |
| TEST18 | Admin create category | { name: 'New Category' } | { data: { success: true, data: { _id: '789', name: 'New Category' } } } | { data: { success: true, data: { _id: '789', name: 'New Category' } } } | Pass |
| TEST19 | useAuth hook returns correct auth state | localStorage with valid auth data | { isAuthenticated: true, isAdmin: false, isLoading: false } | { isAuthenticated: true, isAdmin: false, isLoading: false } | Pass |
| TEST20 | API request interceptor adds auth token | Request to protected endpoint | Request includes Authorization header with token | Request includes Authorization header with token | Pass |

## Test Implementation Guidelines

1. **Setup Test Environment**:
   - Install Jest and React Testing Library
   - Configure Jest in package.json
   - Set up test utilities and mocks

2. **Writing Tests**:
   - Create test files with `.test.js` or `.spec.js` extension
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern
   - Mock external dependencies

3. **Running Tests**:
   - Run all tests: `npm test`
   - Run specific tests: `npm test -- -t "test name"`
   - Run with coverage: `npm test -- --coverage`

4. **Mocking**:
   - Mock API calls using Jest mock functions
   - Mock localStorage for authentication tests
   - Mock router for navigation tests

5. **Best Practices**:
   - Test component behavior, not implementation details
   - Keep tests independent and isolated
   - Use setup and teardown functions
   - Maintain test coverage above 80%
