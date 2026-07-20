# Wasim Akram — Portfolio (Instagram-Style)

A full-stack personal portfolio with an **Instagram-inspired dark UI**, built with Node.js, Express, and MongoDB.

---

## 🚀 Requirements

| Tool | Version |
|------|---------|
| **Node.js** | ≥ 18.0.0 |
| **npm** | ≥ 8.0.0 |
| **MongoDB Atlas** | Free cluster (M0) |

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Edit `.env` in the root directory:

```env
PORT=5000
NODE_ENV=development

# Your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio

# JWT secret — keep this private!
JWT_SECRET=your-random-secret-here

# Admin login credentials
ADMIN_USERNAME=wasimakram
ADMIN_PASSWORD=your-strong-password

# Frontend URL (leave as-is for local dev)
CLIENT_URL=http://localhost:5000
```

### 3. Seed initial data (optional)

```bash
npm run seed
```

### 4. Start development server

```bash
npm run dev
```

> Open **http://localhost:5000** in your browser.

---

## 📂 Project Structure

```
MY_PORTFOLIO/
├── client/               # Frontend (served as static files)
│   ├── index.html        # Instagram-style portfolio page
│   ├── admin.html        # Instagram-style admin dashboard
│   ├── css/
│   │   ├── style.css     # Main Instagram-style stylesheet
│   │   └── admin.css     # Admin panel stylesheet
│   └── js/
│       ├── main.js       # Projects/skills rendering + contact form
│       ├── animations.js # Typewriter + scroll reveal + interactions
│       └── admin.js      # Admin CRUD logic
├── server/               # Backend (Express + MongoDB)
│   ├── app.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── seed.js           # Seed script
├── server.js             # Entry point
├── package.json
└── .env                  # Environment variables (never commit!)
```

---

## 🎨 UI Theme

The portfolio uses an **Instagram-inspired dark theme**:

- 🖤 Pure black background (`#000000`)
- 🌈 Instagram gradient accents (`#833ab4 → #fd1d1d → #fcb045`)
- 📸 3-column post grid for projects (click to open modal)
- 🔵 Story ring highlights for skill categories
- 📱 Bottom navigation bar on mobile
- 🏛️ Sidebar navigation in admin panel

---

## 👤 Personal Info

| Field | Value |
|-------|-------|
| **Name** | Wasim Akram |
| **GitHub** | [github.com/w4simg](https://github.com/w4simg) |
| **LinkedIn** | [linkedin.com/in/wasimz](https://www.linkedin.com/in/wasimz) |
| **Email** | 78690wasimakram@gmail.com |

---

## 🔐 Admin Panel

Visit `/admin.html` to manage projects and skills. Default credentials are set in `.env`.

---

## 📦 Scripts

```bash
npm start      # Production
npm run dev    # Development (with nodemon auto-restart)
npm run seed   # Seed initial demo data to MongoDB
```

---

## 🌐 Deployment

This project includes a `render.yaml` for one-click deploy to [Render.com](https://render.com).

Before deploying:
1. Set all environment variables in Render's dashboard
2. Update `CLIENT_URL` to your production URL
