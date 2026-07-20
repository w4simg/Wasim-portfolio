# Wasim Akram — Developer Portfolio
A sleek, professional, and fully responsive developer portfolio built for showcasing projects and technical skills. It features a custom-built secure Admin Dashboard for easily managing portfolio content dynamically via a database, without needing to touch the code.
## 🚀 Features
- **Professional Dark Theme**: A deep, modern forest green aesthetic tailored for a developer.
- **Fully Responsive**: Flawless layout across mobile, tablet, and desktop screens using modern CSS Grid and Flexbox.
- **Dynamic Content**: Projects and Skills are fetched directly from a MongoDB database.
- **Admin Dashboard**: A secure backend panel to add, edit, or delete Projects and Skills.
- **JWT Authentication**: The admin panel uses secure JSON Web Tokens for authentication.
- **Security Headers**: API is secured with CORS, Helmet, and rate limiting (where applicable).
## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Grid), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens), dotenv for environment variables.
---
## 💻 Installation & Setup
To run this project locally on your machine, follow these steps:
### 1. Prerequisites
- **Node.js** (v14 or higher) installed.
- **MongoDB Atlas** account (or local MongoDB server) for the database.
### 2. Clone the Repository
```bash
git clone https://github.com/w4simg/portfolio.git
cd portfolio
```
### 3. Install Dependencies
```bash
npm install
```

```
### 5. Seed the Database (Optional)
To populate the database with initial sample data for your projects and skills:
```bash
npm run seed
```
### 6. Start the Application
Run the development server using nodemon:
```bash
npm run dev
```
- The main portfolio site will be available at: `http://localhost:5000`
- The Admin Panel will be available at: `http://localhost:5000/admin.html`
---
## 🛡️ Admin Panel Security Explained
You may wonder how the admin panel is secured. Here is a breakdown of the security model used in this application:
1. **Environment Variables**: The admin credentials (`ADMIN_USERNAME` and `ADMIN_PASSWORD`) are stored exclusively in the `.env` file on the server. They are **never** exposed to the frontend code or committed to GitHub.
2. **Server-Side Validation**: When you enter the credentials in the admin panel, they are sent securely to the Node.js backend. The server compares the provided credentials against the hidden environment variables.
3. **JWT Authorization**: Upon a successful login, the server generates a cryptographically signed **JSON Web Token (JWT)** using your highly secure `JWT_SECRET`. This token is sent back to your browser.
4. **Protected API Routes**: Every time the admin panel tries to create, edit, or delete a project/skill, it must attach this JWT to the request headers. The server verifies the token signature before allowing any changes to the database. Without the token, the backend firmly rejects the request.
This lightweight environment-variable approach is highly efficient and perfectly secure for a single-user portfolio site!
---
## 👨‍💻 Author
**Wasim Akram**
- **GitHub**: [@w4simg](https://github.com/w4simg)
- **LinkedIn**: [wasimz](https://www.linkedin.com/in/wasimz)
- **Email**: 78690wasimakram@gmail.com
---
## 📝 License
This project is licensed under the MIT License.
