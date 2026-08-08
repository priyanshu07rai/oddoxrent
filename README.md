# RentOS — Premium Rental Management Platform & Marketplace

RentOS is a full-stack, enterprise-grade **Rental Marketplace & Operations Management System** built with **Django 5.2 REST Framework** and **React 19 + Vite + Tailwind CSS v4**.

Inspired by **Odoo Rentals**, **Apple**, **Linear**, and **Airbnb**, RentOS delivers an ultra-smooth customer booking experience alongside a powerful administration control panel for inventory tracking, dynamic rental pricing, security deposit escrow, and automated late fee processing.

---

## 🌟 Key Features

### 🛒 Customer Marketplace & Booking Experience
* **Odoo Rentals Quick Booking Bar**: Instant search by pick-up date, return date, category, and keywords directly from the hero section.
* **Light / Dark Mode System**: Fully reactive theme toggle (Sun/Moon switch) with crisp light mode by default and deep dark mode styling.
* **Interactive Equipment Catalog**: Filter by categories (*Cameras & Video*, *Electronics*, *Vehicles & E-Bikes*, *Audio & Sound*, *Office Furniture*, *Event & Outdoor*), live search, and price/popularity sorting.
* **Smart Rental Pricing & Deposit Calculator**: Auto-calculates total estimated rental cost based on selected duration (Daily/Weekly passes) and security deposit.
* **Hybrid Guest & Authenticated Cart**: Add gear to cart as a guest or logged-in user without losing state.
* **Step-by-Step Checkout & Order Confirmation**: Fulfillment choice (Doorstep Delivery vs. Store Pickup), address details, and test payment gateway simulation.
* **Account Settings Dashboard**: Profile management, address book, security password changes, and notification preferences.

### ⚙️ Admin Operations Dashboard (`/admin`)
* **Live Operational Metrics**: Real-time stats on active rentals, revenue, pending returns, and held security deposits.
* **Inventory Serial & Condition Tracking**: Manage individual serial numbers, barcodes, QR codes, and item status (*Available*, *Rented*, *Under Repair*, *Damaged*).
* **Dynamic Pricing Engine**: Set daily, weekly, and monthly rates with custom deposit requirements.
* **Quotations & Invoicing System**: Create custom quotes for walk-in customers and convert them into confirmed rental orders.
* **Overdue & Late Fee Automation**: Automated background tracking for overdue items with daily late fee calculations.

---

## 🛠️ Technology Stack

### Backend (`backend-drf/`)
* **Framework**: Django 5.2 & Django REST Framework (DRF)
* **Authentication**: SimpleJWT (JWT Access & Refresh Tokens)
* **Database**: SQLite (Development) / PostgreSQL compatible
* **CORS**: `django-cors-headers` configured for Vite dev server (`http://localhost:5173`)

### Frontend (`frontend-react/`)
* **Framework**: React 19 & Vite
* **Styling**: Tailwind CSS v4 & Custom Design Tokens
* **Animations**: Framer Motion
* **State & Data Fetching**: TanStack React Query (v5) & React Context API
* **Icons**: Lucide React

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your system:
* **Python 3.10+**
* **Node.js 18+** & `npm`
* **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/priyanshu07rai/oddoxrent.git
cd oddoxrent
```

---

### Step 2: Set Up & Run Backend Server (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend-drf
   ```

2. Create and activate a Python virtual environment:
   * **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed sample demo catalog (Products, Categories, Variants, Inventory & Pricing):
   ```bash
   python manage.py seed_data
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   * The REST API will be live at `http://localhost:8000/api/`

---

### Step 3: Set Up & Run Frontend Application (React + Vite)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📦 Seeded Demo Products Included

Running `python manage.py seed_data` populates the marketplace with 8 high-quality equipment rentals:
* **Sony FX3 Cinema Camera Kit** (Cameras & Video) — ₹2,500/day
* **Apple MacBook Pro 16" M3 Max** (Electronics) — ₹3,000/day
* **Super73-RX Electric Adventure Bike** (Vehicles & E-Bikes) — ₹1,800/day
* **DJI Inspire 3 Cinema Drone 8K** (Cameras & Video) — ₹8,000/day
* **Herman Miller Aeron Ergonomic Chair** (Office Furniture) — ₹600/day
* **JBL PartyBox Ultimate PA System** (Audio & Sound) — ₹2,000/day
* **EcoFlow Delta Pro Power Station** (Event & Outdoor) — ₹1,500/day
* **Apple Vision Pro 512GB VR Headset** (Electronics) — ₹4,000/day

---

## 📁 Project Directory Structure

```
oddoxrent/
├── backend-drf/                   # Django REST Framework Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── rental_project/           # Project configuration & URLs
│   └── apps/
│       ├── accounts/              # User authentication & profiles
│       ├── products/              # Products, categories & seed command
│       ├── inventory/             # Serial items & inventory tracking
│       ├── pricing/               # Rental pricing rules & deposits
│       ├── rentals/               # Cart, orders & order items
│       ├── payments/              # Payment gateway integrations
│       ├── deposits/              # Security deposit escrow records
│       ├── latefees/              # Overdue calculations
│       └── reports/               # Operational metrics & analytics
│
└── frontend-react/                # React 19 + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/                   # Axios API service modules
        ├── components/            # UI components (Navbar, Cards, Modals, Forms)
        ├── context/               # ThemeContext, AuthContext, CartContext
        ├── pages/
        │   ├── customer/          # HomePage, ExplorePage, ProductDetailPage, CartPage, AccountPage
        │   ├── auth/              # LoginPage, RegisterPage
        │   └── admin/             # Admin Dashboard & Inventory Management
        └── index.css              # Design tokens & Tailwind setup
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
