# 💻 LapKart — Next-Gen Laptops & Flagship Rigs

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Experience-black?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%20(Aiven)-4479A1?logo=mysql&logoColor=white)](https://aiven.io/mysql)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=black)](https://render.com/)

**LapKart** is a modern, full-stack e-commerce platform purpose-built for browsing, customizing, and purchasing premium laptops, ultraportables, and high-performance gaming rigs. Featuring an interactive 3D hardware showcase powered by Three.js, real-time inventory locking, Razorpay payment gateway integration, dynamic coupon engines, and a comprehensive administrative command center.

---

## 🌐 Live Deployments

* **Frontend (Vercel):** [https://lap-kart.vercel.app](https://lap-kart.vercel.app)
* **Backend API (Render):** [https://lapkart.onrender.com](https://lapkart.onrender.com)
* **API Health Check / Public Catalog:** [https://lapkart.onrender.com/api/public/products](https://lapkart.onrender.com/api/public/products)

---

## ⚡ Architecture Overview

LapKart is built on a decoupled, cloud-native client-server architecture:

```mermaid
flowchart TD
    Client["Browser / Client (React 19 + Three.js)"]
    Vercel["Vercel Edge Network (SPA Routing)"]
    Render["Render Web Service (Docker / Eclipse Temurin 17)"]
    SpringSec["Spring Security 6 (Stateless JWT + RBAC)"]
    AivenDB[("Aiven Cloud (MySQL 8.0)")]
    Razorpay["Razorpay Payment Gateway"]
    ImageKit["ImageKit CDN (Product Assets)"]

    Client -->|HTTPS / Assets| Vercel
    Client -->|REST API Calls (Bearer Token / Cookie)| Render
    Render --> SpringSec
    SpringSec -->|JPA / Hibernate| AivenDB
    Render -->|Order Payment Creation & Verification| Razorpay
    Client -->|Ultra-HD Laptop Renderings| ImageKit
```

---

## ✨ Key Features

### 🛍️ Customer Experience & Catalog
* **Interactive 3D Hero Rigs:** Real-time 3D laptop models rendered with Three.js and React Three Fiber featuring interactive rotation, lighting accents, and dynamic specs highlights.
* **Smart Filter & Search Engine:** Instant multi-facet filtering across brands (*Apple, Asus, Acer, Dell, HP, Samsung, Gigabyte*), categories (*Gaming, Office, Chromebooks*), price ranges, RAM, storage, and GPU configurations.
* **Clean Currency & Decimals Formatting:** All prices, discounts, and order totals formatted with Indian Rupee standards (`₹`) with zero decimal anomalies.
* **Wishlist & Personalization:** Save preferred rigs to a personal wishlist with instant add-to-cart transitions.
* **Customer Reviews & Ratings:** Verified user feedback and star-rating submissions per hardware model.

### 🛒 Cart & Checkout Engine
* **Dynamic Price Locking:** Cart items track real-time discounts and freeze the purchase price upon checkout creation to safeguard against mid-transaction fluctuations.
* **Live Inventory Validation:** Strict server-side stock verification prevents over-purchasing and atomically deducts inventory from MySQL upon confirmed order placement.
* **Coupon & Promo Code Engine:** Validates percentage and fixed discounts dynamically with minimum purchase constraints.
* **Multi-Method Payments:** Seamless checkout flow supporting both **Cash on Delivery (COD)** and **Razorpay Online Payments**.

### 🛡️ Security & Authentication
* **Spring Security 6 & JWT:** Stateless authentication leveraging JSON Web Tokens signed with HMAC-SHA and verified on every protected endpoint.
* **Role-Based Access Control (RBAC):** Strict endpoint segregation between standard `ROLE_CUSTOMER` and privileged `ROLE_ADMIN`.
* **Cross-Site Security:** Configured CORS patterns matching dynamic Vercel preview environments, custom domains, and secure `SameSite=None` HTTP-only cookies.
* **Defensive Cryptography:** Automated SHA-256 fallback hashing guarantees secret key compliance with RFC 7518 (256-bit+ requirement).

### 📊 Admin Operations Hub
* **Inventory Control:** Create, edit, toggle active visibility, and update specifications, stock counts, and image assets.
* **Order Pipeline Management:** Track all customer orders in real time and advance status transitions (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).
* **Category & User Governance:** Manage catalog categories, review registered user accounts, and audit platform usage.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8, React Router v7 |
| **Styling & Animation** | TailwindCSS, Framer Motion, GSAP, Lucide Icons |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Client State & API** | Zustand 5, Axios (with automatic Bearer interceptors) |
| **Backend Framework** | Spring Boot 3.2.4 (Java 17), Spring MVC |
| **Security & Auth** | Spring Security 6, JJWT (Java JWT 0.12.5), BCrypt |
| **Persistence & ORM** | Spring Data JPA, Hibernate, MySQL Connector/J |
| **Payment Gateway** | Razorpay Java SDK 1.4.5 |
| **Database** | MySQL 8.0 hosted on Aiven Cloud with SSL |
| **DevOps & Hosting** | Docker (Multi-stage build), Render, Vercel |

---

## 📂 Project Structure

```
LapKart/
├── backend-lapkart/                 # Spring Boot 3 Application
│   ├── Dockerfile                   # Multi-stage container build (Temurin 17 JRE)
│   ├── pom.xml                      # Maven project descriptor & dependencies
│   ├── mvnw / mvnw.cmd              # Maven wrapper executables
│   ├── .env.example                 # Environment variables blueprint
│   └── src/main/
│       ├── java/com/lapkart/
│       │   ├── controller/          # REST Controllers (Auth, Public, Cart, Order, Admin, etc.)
│       │   ├── dto/                 # Data Transfer Objects & Requests
│       │   ├── entity/              # JPA Database Entities (Product, User, Order, Cart, etc.)
│       │   ├── repository/          # Spring Data JPA Repositories
│       │   ├── security/            # SecurityConfig, JwtFilter, JwtService
│       │   └── service/             # Business Logic & Validation Services
│       └── resources/
│           ├── application.yml      # Spring configuration & variable bindings
│           ├── schema.sql           # Database table DDL definitions
│           └── data.sql             # Initial laptop catalog & category seed data
│
├── frontend-lapkart/                # React 19 + Vite SPA Application
│   ├── vercel.json                  # Single Page Application rewrite rules
│   ├── package.json                 # Node dependencies & build scripts
│   ├── tailwind.config.js           # Theme colors, dark mode tokens & glassmorphism
│   ├── .env.example                 # Client environment template
│   └── src/
│       ├── api/                     # Axios instance configured with baseUrl & interceptors
│       ├── components/              # 3D Hero, Lookbook, Navbar, ProductCards, Modals
│       ├── lib/                     # Currency formatters & utility functions
│       ├── pages/                   # Home, Products, ProductDetail, Cart, Checkout, Orders, Auth
│       │   └── admin/               # Admin Dashboard, Product/Order/Category Management
│       └── store/                   # Zustand Global Stores (authStore, cartStore)
│
├── render.yaml                      # Render Blueprint Infrastructure-as-Code
└── README.md                        # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
* **Java:** JDK 17 or higher (`java -version`)
* **Node.js:** v18.0.0 or higher (`node -v`)
* **Package Manager:** npm or yarn
* **Build Tool:** Maven (or use included `./mvnw`)
* **Database:** MySQL 8.0 instance (local or cloud instance like Aiven)

---

### 1. Database Setup
1. Create a database named `lapkart` in your MySQL server:
   ```sql
   CREATE DATABASE lapkart;
   ```
2. Run [`schema.sql`](file:///d:/Projects/LapKart/backend-lapkart/src/main/resources/schema.sql) and [`data.sql`](file:///d:/Projects/LapKart/backend-lapkart/src/main/resources/data.sql) to seed initial laptop products and categories.

---

### 2. Backend Setup (`backend-lapkart`)
1. Navigate into the backend directory:
   ```bash
   cd backend-lapkart
   ```
2. Create an application `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Configure your database and payment keys in `backend-lapkart/.env`:
   ```env
   DB_PASSWORD=your_mysql_password
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/lapkart?useSSL=false&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=root
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the Spring Boot server:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will boot on `http://localhost:8081`.*

---

### 3. Frontend Setup (`frontend-lapkart`)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend-lapkart
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8081/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

---

## 🔑 Environment Variables Reference

### Backend (`backend-lapkart`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port exposed by the Spring Boot server | `8081` |
| `SPRING_DATASOURCE_URL` | JDBC Connection String | `jdbc:mysql://host:port/dbname?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `avnadmin` / `root` |
| `DB_PASSWORD` | Database password | `your_secret_password` |
| `JWT_SECRET` | 256/512-bit HMAC key for token signing | `404E635266556A586E3272357538782F...` |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant Secret Key | `your_razorpay_secret` |
| `FRONTEND_URL` | Allowed origin for CORS & cookie policy | `https://lap-kart.vercel.app` |

### Frontend (`frontend-lapkart`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Target Spring Boot REST API endpoint | `https://lapkart.onrender.com/api` |

---

## 📡 REST API Reference Summary

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new customer account
* `POST /api/auth/login` — Authenticate credentials, issue JWT, and set HTTP-only cookie
* `POST /api/auth/logout` — Revoke active token session

### Public Catalog (`/api/public`)
* `GET /api/public/products` — Retrieve all active laptop models and specifications
* `GET /api/public/products/{id}` — Retrieve detailed product attributes, images, and reviews
* `GET /api/public/categories` — List all product categories

### Shopping Cart (`/api/cart`)
* `GET /api/cart` — Fetch authenticated user's cart with live subtotals & taxes
* `POST /api/cart/add` — Add laptop unit to cart with stock validation
* `PUT /api/cart/items/{id}` — Adjust item quantity
* `DELETE /api/cart/items/{id}` — Remove item from cart
* `DELETE /api/cart/clear` — Empty current cart

### Orders & Checkout (`/api/orders`, `/api/payment`)
* `POST /api/orders` — Atomically convert cart into an order and deduct inventory
* `GET /api/orders` — List authenticated user's order history
* `GET /api/orders/{id}` — View order breakdown by ID
* `POST /api/payment/create-order` — Initialize Razorpay transaction session
* `POST /api/payment/verify` — Validate Razorpay HMAC signature and mark order as `Paid`

### Administrative Hub (`/api/admin`)
* `GET /api/admin/orders` — View orders across all customers
* `PUT /api/admin/orders/{id}/status` — Update order fulfillment & payment state
* `POST /api/admin/products` — Add a new laptop model to catalog
* `PUT /api/admin/products/{id}` — Update price, specifications, or stock
* `DELETE /api/admin/products/{id}` — Deactivate product

---

## ☁️ Deployment Guide

### Deploying Backend to Render
1. Create a **New Web Service** from your GitHub repo.
2. Set **Root Directory** to `backend-lapkart`.
3. Select **Docker** environment (Render automatically builds [`backend-lapkart/Dockerfile`](file:///d:/Projects/LapKart/backend-lapkart/Dockerfile)).
4. Under **Environment Variables**, supply `DB_PASSWORD`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `FRONTEND_URL`.

### Deploying Frontend to Vercel
1. Import the repository in the **Vercel Dashboard**.
2. Set **Root Directory** to `frontend-lapkart`.
3. Set **Framework Preset** to `Vite`.
4. Add the environment variable:
   ```env
   VITE_API_BASE_URL = https://your-backend-service.onrender.com/api
   ```
5. Deploy! Client routing is handled seamlessly by [`frontend-lapkart/vercel.json`](file:///d:/Projects/LapKart/frontend-lapkart/vercel.json).

---

## 👨‍💻 Author & Contributions

Built by **[Abhishek Kalligudd](https://github.com/Abhishek-kalligudd)**  
*Contributions, suggestions, and pull requests are warmly welcomed.*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
