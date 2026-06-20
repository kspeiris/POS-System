Below is a **technical report** you can copy into your repo as `TECHNICAL_REPORT.md` for **QuickPOS Lite (Single-branch POS)**.

---

# QuickPOS Lite – Technical Report (MERN)

## 1. Project Overview

**QuickPOS Lite** is a small, single-branch Point of Sale (POS) web application designed for a restaurant/café cashier environment. The system supports **role-based access** (Admin, Cashier), product and inventory management, checkout with receipt generation, and basic daily sales reporting.

### 1.1 Goals

* Provide a fast and simple POS workflow for billing customers.
* Enable admins to manage products and view sales reports.
* Maintain secure access control with JWT authentication.
* Store all operational data in a central database (MongoDB).

### 1.2 Target Users

* **Cashier:** handles billing, manages cart, completes orders, prints receipts.
* **Admin:** manages products, categories, users, and views reports.

---

## 2. Scope

### 2.1 In Scope (MVP)

* User authentication (Admin/Cashier)
* Product & category management (Admin)
* POS billing screen with cart
* Orders and payment recording
* Receipt printing (web print / PDF)
* Daily sales summary report
* Basic inventory decrement on sale

### 2.2 Out of Scope (for Lite version)

* Multi-branch support
* Supplier management
* Complex tax rules (VAT tables, multi-tax)
* Kitchen display system (KDS)
* Online ordering / delivery platform integrations

---

## 3. System Architecture (MERN)

### 3.1 High-Level Architecture

* **Frontend:** React + Tailwind CSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Auth:** JWT + bcrypt password hashing

### 3.2 Component Breakdown

**Frontend**

* Login page
* POS screen (cart, product list, checkout modal)
* Admin dashboard (products, categories, users, reports)
* Receipt view (print-friendly)

**Backend**

* REST API (Express)
* Auth middleware for role protection
* Controllers for Products, Orders, Reports, Users
* Data validation layer

**Database**

* Collections: users, products, categories, orders, payments (optional)

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

* Users must login using email/password.
* System issues a JWT token after successful login.
* Routes/pages must be protected by role:

  * Admin: full access
  * Cashier: POS + order history (limited)

### 4.2 Product Management (Admin)

* Add/update/delete products
* Set product price, category, stock quantity
* Enable/disable product visibility (available/unavailable)

### 4.3 POS Operations (Cashier)

* Browse/search products quickly
* Add items to cart
* Modify quantity, remove items
* Apply optional discount (percentage or fixed)
* Checkout:

  * Payment method: Cash / Card (MVP)
  * Record paid amount and return balance (cash)
* Generate receipt and print

### 4.4 Orders

* Store each order with:

  * items, quantities, unit prices
  * total, discount, grand total
  * cashier ID, timestamp
  * payment details
* Update product stock based on sold quantities

### 4.5 Reports (Admin)

* Daily sales:

  * total revenue
  * number of orders
  * breakdown by payment method
* Top-selling products (daily/weekly)

---

## 5. Non-Functional Requirements

### 5.1 Security

* Passwords hashed using bcrypt
* JWT access tokens stored securely (recommended: httpOnly cookies or localStorage for MVP)
* Role-based route guarding in frontend + backend
* Input validation against injection and malformed data

### 5.2 Performance

* POS screen must load quickly
* Search and filtering must respond in under 200ms for typical product count (<1000)
* MongoDB indexes for:

  * product name
  * order createdAt

### 5.3 Usability

* Touch-friendly UI for cashier
* Large buttons, quick search, minimal steps to checkout
* Print-friendly receipt layout

### 5.4 Reliability

* Orders must not be partially saved
* Use server-side validation before finalizing checkout
* Ensure stock cannot drop below 0 (validation + safe updates)

---

## 6. Technology Stack

### 6.1 Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios / Fetch API
* Optional UI libs: Headless UI / shadcn/ui

### 6.2 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* bcryptjs
* jsonwebtoken
* express-validator / zod (validation)
* helmet + cors

### 6.3 Dev Tools

* Postman for API testing
* ESLint + Prettier
* GitHub Actions (optional CI)

---

## 7. Database Design (MongoDB Collections)

### 7.1 Users

**users**

* _id
* name
* email (unique)
* passwordHash
* role: `"admin"` | `"cashier"`
* isActive: boolean
* createdAt, updatedAt

### 7.2 Categories

**categories**

* _id
* name (unique)
* createdAt, updatedAt

### 7.3 Products

**products**

* _id
* name
* sku (optional unique)
* categoryId (ref)
* price
* stockQty
* isAvailable (boolean)
* imageUrl (optional)
* createdAt, updatedAt

### 7.4 Orders

**orders**

* _id
* orderNo (human-friendly)
* cashierId (ref users)
* items: [

  * productId
  * nameSnapshot
  * unitPriceSnapshot
  * qty
  * lineTotal
    ]
* subTotal
* discountType: `"none" | "fixed" | "percent"`
* discountValue
* grandTotal
* payment: {

  * method: `"cash" | "card"`
  * paidAmount
  * change
    }
* createdAt

**Indexes**

* orders.createdAt
* products.name (text index)

---

## 8. API Design (REST)

### 8.1 Auth

* `POST /api/auth/login`
* `GET /api/auth/me`
* `POST /api/auth/logout` (optional)

### 8.2 Users (Admin)

* `POST /api/users` create cashier/admin
* `GET /api/users`
* `PATCH /api/users/:id` activate/deactivate

### 8.3 Categories (Admin)

* `POST /api/categories`
* `GET /api/categories`
* `DELETE /api/categories/:id`

### 8.4 Products

* `POST /api/products` (Admin)
* `GET /api/products` (Admin/Cashier)
* `GET /api/products/:id`
* `PATCH /api/products/:id` (Admin)
* `DELETE /api/products/:id` (Admin)

### 8.5 Orders

* `POST /api/orders` (Cashier)
* `GET /api/orders?date=YYYY-MM-DD` (Admin/Cashier limited)
* `GET /api/orders/:id` (Admin/Cashier)
* `GET /api/reports/daily?date=YYYY-MM-DD` (Admin)

---

## 9. UI / Page Structure

### 9.1 Cashier

1. Login
2. POS Screen

   * product list + search
   * cart panel
   * checkout modal
3. Order History (optional)

### 9.2 Admin

1. Dashboard
2. Products
3. Categories
4. Users (cashiers)
5. Reports (daily sales + top items)

---

## 10. Key Workflows

### 10.1 Checkout Workflow

1. Cashier selects products → cart
2. Cashier clicks “Checkout”
3. Payment method selected (cash/card)
4. Backend validates:

   * products exist
   * stock is sufficient
5. Backend creates order
6. Backend updates stock atomically
7. UI shows receipt → print option

### 10.2 Stock Update Strategy

Use **transaction-like** behavior:

* Validate all items first
* Update stock using `$inc: { stockQty: -qty }` and ensure `stockQty >= qty` check
* If any item fails, reject order creation

---

## 11. Testing Strategy

### 11.1 Backend Tests

* Auth tests (login, protected routes)
* Product CRUD tests
* Order creation tests:

  * stock decrement
  * totals calculations
  * invalid order rejection

### 11.2 Frontend Tests (Optional Lite)

* Component tests for cart totals
* Route guard tests for roles

---

## 12. Deployment Plan

### 12.1 Deployment Options

* **Frontend:** Vercel / Netlify
* **Backend:** Render / Railway
* **Database:** MongoDB Atlas

### 12.2 Environment Variables

* `MONGO_URI`
* `JWT_SECRET`
* `CLIENT_URL`
* `NODE_ENV`

---

## 13. Future Enhancements

* Barcode scanner support
* Refunds and void orders
* Tax/VAT configuration
* Multi-branch support
* Kitchen display + printer integration
* Offline-first mode (IndexedDB queue)

---

## 14. Conclusion

QuickPOS Lite provides a practical MERN-based POS system with clean separation of roles, reliable order handling, and essential reporting. The MVP keeps scope small while still demonstrating real-world engineering skills: authentication, RBAC, CRUD, transactional order logic, and reporting.

---

If you want, I can also generate:

* **Full folder structure + all code files**
* **DB seed script (demo products + admin + cashier)**
* **Professional README + screenshots plan**


QuickPOS Lite (MERN) — Frontend Technical Report (20 Pages)
1. Introduction

This document describes the frontend design and implementation plan for QuickPOS Lite, a single-branch restaurant POS web application. The frontend is responsible for UI rendering, navigation, role-based access control, state management (cart/orders), form handling, and API integration with the backend.

The UI covers 20 pages/screens, including cashier workflows (billing → checkout → receipt → history) and admin workflows (dashboard → CRUD → reports → settings), plus error/support pages.

2. Frontend Technology Stack
2.1 Core

React (Vite): SPA architecture, fast development build.

React Router DOM: client-side routing for 20 pages.

Tailwind CSS: consistent UI styling and responsive layout.

2.2 State & Data

Context API (recommended for small projects):

AuthContext → user + token + role

CartContext → cart items + totals

Optional upgrade:

Redux Toolkit / Zustand if state grows (not required for Lite).

2.3 API & Utilities

Axios: HTTP client with interceptors.

React Hook Form + Zod/Yup: form validation (admin forms, login).

Day.js: formatting dates for orders and reports.

3. UI Pages Implemented (20)
Public / Shared

Landing (/)

Login (/login)

Unauthorized (/unauthorized)

404 (*)

Cashier

POS Billing (/pos)

Checkout (/pos/checkout) (or modal)

Receipt (/orders/:id/receipt)

Order History (/orders)

Order Details (/orders/:id)

Admin

Admin Dashboard (/admin)

Products Management (/admin/products)

Product Form (/admin/products/new, /admin/products/:id/edit)

Categories Management (/admin/categories)

Add/Edit Category (Modal or Page)

Users Management (/admin/users)

Add/Edit User (Modal or Page)

Reports Daily Sales (/admin/reports/daily)

Settings (/admin/settings)

Profile (/profile)

Note: Some numbers overlap because “modal forms” are pages in the feature list but implemented as route pages or dialogs depending on UX choice.

4. Frontend Architecture
4.1 Folder Structure (Recommended)
src/
  app/
    App.jsx
    routes.jsx
  api/
    axios.js
    authApi.js
    productApi.js
    orderApi.js
    reportApi.js
    userApi.js
    settingsApi.js
  components/
    layout/
      Navbar.jsx
      Sidebar.jsx
      AdminLayout.jsx
      CashierLayout.jsx
      Footer.jsx
    ui/
      Button.jsx
      Input.jsx
      Modal.jsx
      Table.jsx
      Badge.jsx
      Loader.jsx
      Toast.jsx
    pos/
      ProductGrid.jsx
      CartPanel.jsx
      CheckoutModal.jsx
      TotalsSummary.jsx
  pages/
    public/
      Landing.jsx
      Login.jsx
      Unauthorized.jsx
      NotFound.jsx
    cashier/
      POS.jsx
      Checkout.jsx
      Receipt.jsx
      Orders.jsx
      OrderDetails.jsx
    admin/
      Dashboard.jsx
      Products.jsx
      ProductForm.jsx
      Categories.jsx
      Users.jsx
      ReportsDaily.jsx
      Settings.jsx
    shared/
      Profile.jsx
  context/
    AuthContext.jsx
    CartContext.jsx
  hooks/
    useAuth.js
    useCart.js
    useDebounce.js
  utils/
    formatMoney.js
    formatDate.js
    calcTotals.js

4.2 Layout System

CashierLayout:

Top bar + logout + optional quick nav (POS / Orders)

AdminLayout:

Top nav or sidebar (Dashboard / Products / Categories / Users / Reports / Settings)

Layouts reduce duplication and ensure consistent UI.

5. Routing & Navigation
5.1 Route Groups

Public routes: landing, login

Cashier routes: pos, checkout, orders, receipt

Admin routes: admin dashboard + CRUD + reports + settings

Shared: profile

5.2 Route Guards (RBAC)

RBAC is enforced in two layers:

Frontend Guard: prevents users from opening restricted pages

Backend Guard: final enforcement (frontend cannot be trusted)

Implementation approach

ProtectedRoute checks token and role.

If no token → redirect to /login

If role mismatch → redirect to /unauthorized

6. State Management Design
6.1 Auth State

Stored

user (id, name, role)

token (JWT)

loading state while verifying

Storage

MVP: localStorage

Better security: httpOnly cookies (backend change required)

6.2 Cart State (Cashier)

cartItems: { productId, name, price, qty, stockSnapshot }

discount: type + value

derived totals: subtotal, discount amount, grand total

Operations

addItem(product)

increment/decrement qty

removeItem

clearCart

setDiscount

6.3 Orders / Reports State

fetched per page using API calls (no need global state)

caching optional (React Query can be added later)

7. API Integration Layer
7.1 Axios Setup

Base URL: from .env

Request interceptor:

attach Authorization: Bearer <token>

Response interceptor:

if 401 → logout + redirect to login

7.2 API Modules

authApi: login, me

productApi: list, create, update, delete

orderApi: create order, get orders, get single order

reportApi: daily report

userApi: list/create/update

settingsApi: get/update shop settings

This keeps pages clean and maintainable.

8. UI/UX Implementation Details
8.1 POS Billing Page (Key UI)

left: product grid with category filter + search

right: cart panel with qty controls + checkout

Performance

debounced search input (useDebounce)

memoized cart totals (useMemo)

8.2 Checkout Page

payment method selection

numeric keypad (optional)

change calculation (cash)

8.3 Receipt Page

print-friendly design

option: window.print() or generate PDF later

8.4 Admin CRUD Pages

Table view: search, filter, pagination

Forms:

validation

optimistic UI optional

toasts for success/error

9. Form Validation Rules (Frontend)

Login:

email required + valid

password min 6

Product:

name required

price > 0

stockQty >= 0

Category:

name required + unique check handled by backend

User:

name required

email valid

role required

password required on create

10. Error Handling

Global error toast component for API failures

Page-level empty states:

“No products found”

“No orders for selected date”

Unauthorized redirect handling

11. Testing Plan (Frontend)
11.1 Manual Test Checklist

Login + role routing

Cashier: POS → checkout → receipt → order history

Admin: CRUD operations + reports + settings

Unauthorized access blocked

404 route works

11.2 Optional Automated Tests

React Testing Library:

cart total calculations

protected route logic

product form validation

12. Build & Run (Frontend)
12.1 Commands

npm install

npm run dev

npm run build

npm run preview

12.2 Environment Variables

VITE_API_URL=http://localhost:5000/api

13. Conclusion

The QuickPOS Lite frontend provides a complete POS user experience across 20 screens, using a clean, modular React architecture with Tailwind styling. The solution emphasizes RBAC, reusable layouts/components, predictable state management (Auth + Cart), and maintainable API integration, making it suitable as a portfolio-ready MERN frontend.

