# 🛒 QuickPOS Lite

![hero](screenshots/hero.png)

QuickPOS Lite is a modern, fast, and light-weight single-branch **Point of Sale (POS)** system designed for restaurants, cafés, and retail shops. Built on the robust **MERN Stack** (MongoDB, Express, React, Node.js), it provides an efficient, clean user experience for cashiers to process bills and admins to manage inventory, users, and daily sales reports.

---

## 🏗️ System Architecture

QuickPOS Lite follows a clean client-server architecture with secure API communication:

```mermaid
graph TD
    subgraph Client [Frontend - React + TailwindCSS]
        UI[React UI Components]
        Context[Cart & Auth Context]
        Axios[Axios API Client]
    end

    subgraph Server [Backend - Express.js & Node.js]
        Routes[API Routes]
        Auth[JWT & Bcrypt Auth Middleware]
        Controllers[Controllers]
        Uploads[Multer File Uploads]
    end

    subgraph Database [MongoDB]
        Mongoose[Mongoose Models]
        DB[(MongoDB Database)]
    end

    UI --> Context
    Context --> Axios
    Axios -->|HTTP Requests / Multipart Form| Routes
    Routes --> Auth
    Auth --> Controllers
    Controllers --> Uploads
    Controllers --> Mongoose
    Mongoose --> DB
```

### Key Technical Specs:
* **Frontend:** React (Vite), TailwindCSS, React Router, Lucide Icons.
* **Backend:** Node.js, Express, JWT Authentication, Multer (Local Storage uploads).
* **Database:** MongoDB with Mongoose ODM.

---

## ✨ Features

### 👤 User Roles & Authentication
* **Role-Based Access Control (RBAC):** Admin and Cashier roles.
* **Secure JWT Login:** Password hashing via Bcrypt.
* **User Profiles:** Customize profile pictures, name, and email details.

### 💻 Cashier Workspace (POS)
* **Real-time Product Grid:** Filter by categories and search instantly.
* **Interactive Cart:** Easily increment/decrement quantities and remove items.
* **Opaque Checkout Modal:** Simple payment method selection (Cash, Card, QR) with quick-cash change calculation.
* **Print-Ready Receipts:** Instant receipt window for thermal printers or saving as PDF.

### 🛡️ Admin Dashboard
* **Sales Analytics:** Daily reports, metrics, and low-stock indicators.
* **Product Catalog Management:** Add, edit, or remove items, assign categories, and upload food images.
* **Category Management:** Manage categorization to streamline the checkout process.
* **User Management:** Create new system users and toggle active/inactive status.

---

## 📸 Screenshots

![UI](screenshots/pos1.png)
![UI](screenshots/pos2.png)
![UI](screenshots/pos3.png)
![UI](screenshots/pos4.png)
![UI](screenshots/pos5.png)
![UI](screenshots/pos6.png)
![UI](screenshots/pos7.png)
![UI](screenshots/pos8.png)
![UI](screenshots/pos9.png)
![UI](screenshots/pos10.png)
![UI](screenshots/pos11.png)
![UI](screenshots/pos12.png)

---

## 🚀 Setup & Installation

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Local or Atlas URI

### 1. Clone & Clean Install
Clone the repository and install dependencies for both the frontend and backend.

#### Backend Setup
```bash
cd backend
npm install
```

Configure environment variables in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quickpos
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Seed the database with sample products and users:
```bash
npm run data:import
```

Start the backend server:
```bash
npm run dev
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

Configure environment variables in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🛠️ Folder Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection configurations
│   │   ├── controllers/     # Route logic handlers
│   │   ├── middleware/      # JWT protection & multer uploads
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Data seeders
│   └── uploads/             # Locally uploaded product & profile images
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios configurations
│   │   ├── components/      # Reusable POS components & UI
│   │   ├── context/         # Auth and Cart global state
│   │   ├── pages/           # Admin pages, Cashier pages, Profile
│   │   └── utils/           # Number & currency formatting
│
└── UI images/               # Application screenshots
```

---

## 📄 License
This project is licensed under the MIT License.
