# 🎓 College Management & Information System (MERN Stack)

A complete, modern, production-grade **College Management & Information Website** built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js, Tailwind CSS).

---

## 🏛️ System Architecture & Key Philosophy

This platform is architected into two core systems:
1. **Public College Website**: Fast, SEO-optimized, accessible portal for prospective students, parents, and visitors showcasing courses, faculty, events, research, gallery, facilities, and dynamic announcements.
2. **Single Admin CMS Dashboard**: Protected central control panel enabling the designated college administrator to manage all 16 dynamic content modules in real time.

> 🔒 **Single-Role Architecture**:
> This platform strictly implements a single authenticated **ADMIN** role. There are **NO** student, faculty, staff, parent, or visitor login systems, ensuring zero confusion and centralized administrative authority.

---

## 🚀 Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React icons, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` salted password hashing
- **File Uploads**: Multer handling multipart/form-data for images and official documents/PDFs (up to 15MB)
- **Security**: Helmet, CORS origin configuration, rate-limiting, and express error handling

---

## 📁 Project Structure

```text
d:/College Management/
├── client/                     # React Single Page Application (Vite)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # StatCard, DataTable, FileUploader, ConfirmDialog
│   │   │   ├── common/         # Button, Modal, Card, StatusBadge, SearchBar, Pagination, RichTextEditor, SEO
│   │   │   └── layout/         # PublicHeader, PublicFooter, NoticeTicker, AdminSidebar, AdminHeader
│   │   ├── context/            # AuthContext, ToastContext, CollegeContext
│   │   ├── pages/
│   │   │   ├── admin/          # 17 Single-Admin management panels
│   │   │   └── public/         # 24 Public academic pages & detail views
│   │   ├── services/           # Centralized Axios API services with JWT interceptors
│   │   ├── App.jsx             # Route definitions (Public & Protected Admin)
│   │   ├── main.jsx            # App bootstrap & context providers
│   │   └── index.css           # Tailwind CSS directives & custom styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express.js REST API Server
│   ├── config/                 # MongoDB connection (db.js) & Multer config (multer.js)
│   ├── controllers/            # 17 Business logic controllers
│   ├── middleware/             # auth.js (JWT Admin verify), errorHandler.js
│   ├── models/                 # 15 Mongoose schemas
│   ├── routes/                 # 16 Express modular route files
│   ├── uploads/                # Local uploaded files (images, PDFs)
│   ├── utils/                  # slugify.js helper
│   ├── .env                    # Server environment configuration
│   ├── seed.js                 # Complete academic sample data & root admin seeder
│   └── server.js               # Express application entry point
│
├── package.json                # Root concurrent scripts
└── README.md                   # Full documentation
```

---

## 🛠️ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.x or later installed
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` (or a MongoDB Atlas URI)

### 1. Install Dependencies
From the root workspace directory, run:
```bash
# Install root, backend, and frontend packages
npm run install:all
```
*(Or install individually: `cd server && npm install`, then `cd client && npm install`)*

---

### 2. Environment Variables Configuration

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/college_management
JWT_SECRET=college_mgmt_super_secret_jwt_key_2026_production_grade
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env` or Vite proxy):
Vite is pre-configured in `client/vite.config.js` to automatically proxy `/api` and `/uploads` requests to `http://localhost:5000`.

---

### 3. Seed Database with Realistic Academic Data

Populate the database with pre-configured departments, professors, notices, albums, events, documents, and the root Admin account:
```bash
cd server
npm run seed
```

#### 🔑 Default Admin Credentials:
- **Admin Email**: `admin@college.edu`
- **Master Password**: `Admin@12345`
- **Dashboard URL**: `http://localhost:5173/admin/login`

---

### 4. Running the Application Locally

#### Option A: Run Both Concurrently from Root
```bash
npm run dev
```

#### Option B: Run in Separate Terminals
```bash
# Terminal 1: Start Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Start React Frontend (Port 5173)
cd client
npm run dev
```

Visit the application at:
- 🌐 **Public Website**: [http://localhost:5173](http://localhost:5173)
- 🔐 **Admin Login**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- 📡 **Backend REST API**: [http://localhost:5000/api/college](http://localhost:5000/api/college)

---

## 📊 Modules & Capabilities

| Module | Public URL | Admin Dashboard Control |
| :--- | :--- | :--- |
| **College Info & Vision** | `/about`, `/vision-mission`, `/principal-message` | Overview, history, principal address, accreditations |
| **Academic Departments** | `/departments`, `/departments/:slug` | Programs (UG/PG), intake capacity, lab details, HOD |
| **Faculty & Staff** | `/staff`, `/staff/:slug` | Profiles, designations, research publications, emails |
| **Courses & Programs** | `/courses` | Fee structure, eligibility, durations, intake seats |
| **Admissions & Forms** | `/admissions`, `/admissions/notices` | Fee structures, admission notices, downloadable forms |
| **Campus Events** | `/events`, `/events/:slug` | Upcoming/past workshops, conferences, symposia |
| **Articles & Research** | `/articles`, `/articles/:slug` | Faculty research, institutional whitepapers, blogs |
| **Achievements & Awards** | `/achievements` | Accreditations, student rankings, awards, NIRF |
| **Notices & Circulars** | `/notices`, `/notices/:slug` | Tickers, circulars, PDFs, category filters, expiry dates |
| **Photo/Video Gallery** | `/gallery`, `/gallery/:slug` | Albums, high-res photos, interactive lightbox viewer |
| **Public Downloads** | Header/Footer `/admissions` | Syllabus PDFs, mandatory disclosures, anti-ragging |
| **Contact & Inquiries** | `/contact` | Lead collection, subject classification, read/unread flags |
| **Custom CMS Pages** | `/pages/:slug` | WYSIWYG dynamic pages, terms, student charters |
| **Navigation Menus** | Header & Footer | Custom menu links, positioning, order, open in new tab |
| **SEO & Social Share** | Meta tags across all routes | Default meta titles, OpenGraph images, Google Analytics |
| **Website Settings** | Top Marquee, Footer, Contact | Campus coordinates, phones, social URLs, banner ticker |

---

## 🧪 Production Build & Verification

To verify and generate optimized production bundles:

```bash
# Build React Single Page Application
cd client
npm run build
```

---

## 📜 License
This software is developed for institutional academic excellence under the MIT License.
