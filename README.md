# 🏥 TrustMeds | The Future of Healthcare Connectivity

![TrustMeds Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

TrustMeds is a premium, full-stack ecosystem designed to bridge the gap between medical professionals, vendors, and patients. It combines a powerful medicine search and comparison engine with a robust doctor-patient appointment booking system.

---

## ✨ Key Features

### 🤕 For Patients
- **Smart Medicine Search**: Find and compare medicine prices across verified vendors.
- **Find Doctors**: Discover medical professionals based on specialization and experience.
- **Instant Booking**: Real-time slot selection and appointment management.
- **AI Health Assistant**: Get instant answers to your medical queries.

### 👨‍⚕️ For Doctors
- **Practice Management**: Set your availability, consultation fees, and profile.
- **Appointment Dashboard**: Track and manage your upcoming patient visits.
- **Professional Growth**: Showcase your experience and qualifications.

### 🏪 For Vendors
- **Inventory Control**: Manage stocks and pricing in real-time.
- **Order Analytics**: Handle incoming patient orders with ease.
- **Verified Status**: Build trust with verified badges and verified addresses.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js |
| **DevOps** | Docker, Docker-compose, Vercel-ready |

---

## 🚀 Getting Started

### 🐳 The Docker Way (Recommended)
Launch the entire universe with a single command:
```bash
docker-compose up
```
*Wait for the logs to clear, then visit: `http://localhost:5173`*

### 💻 Manual Setup

#### 1. Backend ⚙️
```bash
cd backend
npm install
npm run seed  # Loads initial medicine data
npm run dev
```

#### 2. Frontend 🎨
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Map

```text
TrustMeds/
├── 📂 backend/                 # Express Server & Logic
│   ├── 🛠️ models/              # User, Appointment, Medicine, Order
│   ├── 🛤️ routes/              # API Endpoints
│   └── 🧪 seeds/               # Initial Data
├── 📂 frontend/                # React Universal UI
│   ├── 📄 App.jsx              # Routing Engine
│   └── 📂 pages/               # Functional Views
└── 🐳 docker-compose.yml       # Container Orchestration
```

---

## 📝 API Cheat Sheet

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Create Patient/Doctor/Vendor accounts |
| `/api/public/doctors` | `GET` | Public | Search the doctor directory |
| `/api/appointments/book` | `POST` | Patient | Reserve a consultation slot |
| `/api/vendor/inventory` | `GET` | Vendor | Manage medicine stocks |

---

## 🚢 Quick Deployment

1. **GitHub**: Push your repo.
2. **Backend**: Deploy the `/backend` folder to Railway/Render.
3. **Frontend**: Deploy the `/frontend` folder to Vercel.
4. **Env**: Add `MONGODB_URI` and `JWT_SECRET` to your hosting provider.

---

## 🤝 Contribution & License

We ❤️ contributors! Feel free to fork the repo and open a PR.
This project is open-source and ready for the community.

---

**Made with ❤️ by the TrustMeds Team**