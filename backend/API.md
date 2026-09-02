# API Documentation — CermatPutra E-Commerce Backend

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

All protected endpoints require a **JWT Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

Obtain a token by calling `POST /api/v1/auth/login`.

---

> **Interactive Documentation**
> Full interactive API documentation with detailed request/response payload schemas is available via **Swagger UI** at:
> ```
> http://localhost:3001/api/v1/docs
> ```
> The server must be running to access it.

---

## Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | — | Check if the backend service is running |

---

### Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | — | Register a new user account |
| `POST` | `/auth/login` | — | Login and receive a JWT token |
| `GET` | `/auth/profile` | ✅ Required | Get the authenticated user's profile |

---

### Products (`/produk`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/produk` | — | Get all products (supports filter by category, search by name, pagination) |
| `GET` | `/produk/:id` | — | Get product detail including reviews |
| `POST` | `/produk` | ✅ Admin only | Create a new product (with image upload via Cloudinary) |
| `PUT` | `/produk/:id` | ✅ Admin only | Update product data (partial update supported) |
| `DELETE` | `/produk/:id` | ✅ Admin only | Delete a product by ID |

---

### Shopping Cart (`/keranjang`)

All cart endpoints require authentication.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/keranjang` | ✅ Required | Get the current user's cart with auto-calculated total price |
| `POST` | `/keranjang` | ✅ Required | Add a product to the cart (validates stock availability) |
| `PUT` | `/keranjang/:itemId` | ✅ Required | Update item quantity in the cart |
| `DELETE` | `/keranjang/:itemId` | ✅ Required | Remove an item from the cart |

---

### Address & Shipping (`/alamat`)

All address endpoints require authentication.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/alamat` | ✅ Required | Get all addresses belonging to the logged-in user |
| `POST` | `/alamat` | ✅ Required | Add a new shipping address |
| `PUT` | `/alamat/:id` | ✅ Required | Update an existing address |
| `DELETE` | `/alamat/:id` | ✅ Required | Delete an address (auto-promotes oldest remaining as primary) |
| `POST` | `/alamat/cod/verifikasi` | ✅ Required | Verify if a destination coordinate is within COD radius (50 km, Haversine formula) |
| `POST` | `/alamat/ongkir/biteship` | ✅ Required | Get shipping rates from multiple couriers (JNE, J&T, SiCepat) via Biteship API |

---

### Orders & Checkout (`/pesanan`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/pesanan/checkout` | ✅ Required | Create a new order, reduce stock, and initialize a Midtrans Snap payment session. Returns `snap_token` and `redirect_url`. |
| `GET` | `/pesanan` | ✅ Required | Get order history for the logged-in user |
| `GET` | `/pesanan/:id` | ✅ Required | Get full detail of a specific order |
| `POST` | `/pesanan/webhook` | — *(public)* | Midtrans payment notification webhook. Verifies SHA-512 signature and updates order/payment status automatically. |

---

## Notes

- All protected endpoints return `401 Unauthorized` if the token is missing or invalid.
- Admin-only endpoints return `403 Forbidden` if the user's role is not `ADMIN` or `SUPER_ADMIN`.
- The Midtrans webhook endpoint (`POST /pesanan/webhook`) is intentionally public — security is enforced via Midtrans signature key verification.
- Biteship shipping rate endpoint supports mock mode when `BITESHIP_API_KEY` starts with `biteship_test_` to avoid consuming real API balance during development.
