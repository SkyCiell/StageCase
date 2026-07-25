# StageCase — Premium Concert Ticket Booking Platform

> **"Every Stage Begins Here."**  
> Official full-stack concert ticket booking application for the Indonesian band **Crayon Case**.

---

## 🎨 Visual Identity & Palette

Inspired by **QinXiao** from *Wuthering Waves* — elegant, calm, luxurious, and modern.

| Token | Hex | Role |
|---|---|---|
| Background | `#151617` | Primary dark backdrop |
| Secondary BG | `#1E2022` | Cards & secondary panels |
| Surface | `#25282B` | Interactive components & glass panels |
| Primary Jade | `#2D6F73` | Primary brand color & active states |
| Dark Jade | `#1F5053` | Hover states & accents |
| Accent Gold | `#B89B5E` | Highlights, VVIP tiers & prices |
| Soft Ivory | `#EEE9DF` | Primary text |
| Text Secondary | `#A8AFB4` | Captions & subtle text |
| Border | `rgba(255,255,255,0.08)` | Thin glass borders |

---

## 🛠 Tech Stack

- **Backend**: Express.js, Sequelize ORM, MySQL, JWT, bcrypt, Multer, Nodemailer, QRCode
- **Web Frontend**: React 19, Vite, Tailwind CSS v3, Framer Motion, TanStack Query, React Router v6, Axios
- **Mobile**: React Native, Expo, React Navigation, Reanimated
- **Database**: MySQL 8.0+

---

## 🚀 Getting Started

### 1. Database Setup

Create the database in MySQL and run the schema file:
```bash
mysql -u root -p < docs/schema.sql
```

### 2. Backend API Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials (DB_NAME, DB_USER, DB_PASSWORD)
npm install
npm run dev
```

The API will start at `http://localhost:5000`.

### 3. Web Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The web app will open at `http://localhost:5173`.

### 4. Mobile App Setup (Expo)

```bash
cd mobile
npm install
npx expo start
```

Press `a` to run on Android Emulator or scan the QR code using the **Expo Go** app on iOS / Android.

---

## 📁 Repository Structure

```
StageCase/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Multer config
│   │   ├── controllers/     # Auth, Concerts, Bookings, Payments, Admin
│   │   ├── models/          # Sequelize models & associations
│   │   ├── routes/          # Express route declarations
│   │   ├── middleware/      # JWT auth, validation, error handler
│   │   └── services/        # Email, QR code generator
│   ├── uploads/             # Static uploads (posters, payments, avatars)
│   └── server.js            # Main Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components, Layout, Navbar, Footer
│   │   ├── context/         # AuthContext, BookingContext
│   │   ├── pages/           # Landing, Auth, User, Admin pages
│   │   ├── services/        # API client & services
│   │   └── utils/           # Formatters & design utilities
│   ├── tailwind.config.js   # StageCase QinXiao theme configuration
│   └── index.html
├── mobile/                  # React Native Expo App → github.com/SkyCiell/StageCase---Mobile
├── docs/
│   └── schema.sql           # Complete MySQL database schema
└── README.md
```

---

## 🔑 Default Admin Account

- **Email**: `admin@stagecase.id`
- **Password**: `Admin@12345`

---

© 2024 StageCase. All rights reserved. Every Stage Begins Here.
