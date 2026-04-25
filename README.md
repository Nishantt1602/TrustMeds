# 🏥 TrustMeds - Premium Healthcare Ecosystem

TrustMeds is a state-of-the-art healthcare platform that bridges the gap between Patients, Doctors, and Vendors. Built with a focus on modern aesthetics, real-time interaction, and secure transactions.

![TrustMeds Banner](C:\Users\Hp\.gemini\antigravity\brain\ec5b235d-8533-47f4-9f3d-5ae8883cb1d8\trustmeds_3d_medical_icon_1777085616860.png)

## 🌟 Key Features

### 🤕 For Patients
*   **Unified Search**: Find both medicines and specialist doctors in a single search bar.
*   **Smart Cart**: Group items from multiple vendors and checkout in one click.
*   **Health Snapshot**: Real-time tracking of active prescriptions and pending lab reports.
*   **Appointment Checkout**: Secure payment gateway for booking doctor consultations.
*   **AI Health Assistant**: Get instant medical guidance and symptom analysis.

### 👨‍⚕️ For Doctors
*   **Dynamic Hub**: Manage on-duty status, appointment queues, and patient records.
*   **Slot Management**: Highly flexible availability scheduler with real-time booking updates.
*   **Home Visit Surcharge**: Define custom fees for home consultations.
*   **Secure Chat**: Real-time patient communication via a premium chat interface.

### 🏪 For Vendors
*   **Inventory Control**: Advanced stock tracking with low-stock alerts.
*   **Revenue Analytics**: Track daily earnings and pending orders at a glance.
*   **Order Fulfillment**: Streamlined status updates from Pending to Dispatched.

---

## 📸 Premium Interface Highlights

| Pharmacy Services | Expert Consultations | Health Monitoring |
| :---: | :---: | :---: |
| ![Medicine](C:\Users\Hp\.gemini\antigravity\brain\ec5b235d-8533-47f4-9f3d-5ae8883cb1d8\trustmeds_3d_medical_icon_1777085616860.png) | ![Doctor](C:\Users\Hp\.gemini\antigravity\brain\ec5b235d-8533-47f4-9f3d-5ae8883cb1d8\trustmeds_3d_doctor_icon_1777085631821.png) | ![Snapshot](C:\Users\Hp\.gemini\antigravity\brain\ec5b235d-8533-47f4-9f3d-5ae8883cb1d8\trustmeds_3d_health_snapshot_1777085647044.png) |

---

## 📂 Project Structure

```text
TrustMeds/
├── frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, Chat, PrivateRoutes)
│   │   ├── context/         # Auth & Cart State Management
│   │   ├── pages/
│   │   │   ├── Auth/        # Login & Multi-Role Registration
│   │   │   ├── Core/        # Search, Cart, Checkout, Appointment Booking
│   │   │   ├── Dashboard/   # Profile, MyAppointments
│   │   │   └── Home/        # Role-specific Hubs (Patient, Doctor, Vendor)
│   │   └── services/        # Axios API Configuration
├── backend/                 # Node.js Express Backend
│   ├── src/
│   │   ├── config/          # DB & Environment Config
│   │   ├── middlewares/     # Auth & Role-based Guardrails
│   │   ├── models/          # Mongoose Schemas (User, Order, Appointment)
│   │   └── routes/          # API Endpoints
└── README.md                # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (Local or Atlas)

### Local Development
1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI, PORT, JWT_SECRET
   npm start
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌍 Deployment Guide

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas.
2. Get your connection string.
3. Replace `localhost` in your backend `.env` with the Atlas URI.

### Vercel (Frontend & Backend)
1. **Backend**: Push to GitHub, connect to Vercel, set Environment Variables.
2. **Frontend**: Push to GitHub, connect to Vercel, set `VITE_API_URL` to your backend URL.

---
the TrustMeds Community.
