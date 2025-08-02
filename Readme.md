# 💰 Digital Wallet Backend

This is the backend service for a **Digital Wallet System**, built with **Node.js**, **TypeScript**, **Express**, and **MongoDB(Mongoose)**. It provides RESTful APIs for user management, agent/admin functionality, and wallet transactions like top-up, send money, cash-in, and cash-out.

---

## 📚 Project Overview

This backend system supports:

- 🧑 **User registration and authentication**
- 🏦 **Admin and Agent roles** with distinct permissions
- 💸 **Wallet operations**: Top-up, Withdrawal, Send Money, Cash In/Out
- 📈 **Transaction tracking**
- 🔒 **JWT-based secure access**
- 🛠️ **Role-based authorization middleware**
- 📁 Well-structured modular codebase (Moduler pattern)
- 📄 Centralized error handling

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/I-am-MoRsHeD/digital-wallet-backend-as5.git
cd digital-wallet-backend-as5
```
### 2. Clone the repository
```bash
npm install

```
### 3. Create a .env file

```bash
PORT=PORT
MONGO_URL=MONGO_URL
NODE_ENV=development

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=secret
JWT_REFRESH_EXPIRES=30d

DEFAULT_ADMIN_EMAIL=defaultemail
DEFAULT_ADMIN_PASSWORD=password

```
### 4. Run the project
```bash
npm run dev
```

### 5. Api endpoints summury

#### A. User Routes

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| POST   | `/api/v1/user/register` | Register as a new user        |
| GET   | `/api/v1/user`  | Get all the users (Admin only)              |
| GET    | `/api/v1/user/:id`    | Get profile of logged-in user |
| PATCH  | `/api/v1/user/:id`    | Update own profile            |

#### B. Auth Routes

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| POST   | `/api/v1/auth/login` | Login in as a User/Agent/Admin       |
| POST   | `/api/v1/auth/logout`  | Login in as a User/Agent/Admin 

#### C. Wallet Routes

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET   | `/api/v1/wallets` | Get all the wallets(Admin only)      |
| POST   | `/api/v1/wallets/block-unblock/:id`  | Block any users wallet (Admin only) 
| GET   | `/api/v1/wallets/user`  | Get user's own wallets (User only) 
| POST   | `/api/v1/wallets/user/top-up`  | TopUp to user's own wallet (User only) 
| POST   | `/api/v1/wallets/user/withdraw`  | Withdrawal from user's own wallet (User only) 
| POST   | `/api/v1/wallets/user/send-money`  | Send money from user's own wallet to another user's wallet (User only)   |
| GET   | `/api/v1/wallets/agent`  | Get agent's own wallets (Agent only)
| POST   | `/api/v1/wallets/agent/cash-in`  | Cash in to any user's wallet (Agent only)
| POST   | `/api/v1/wallets/agent/cash-out`  | Cash out from any user's wallet (Agent only)

### D. Transaction Routes
| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET   | `/api/v1/transactions` | Get all the transactions (Admin only)      |
| GET   | `/api/v1/transactions/me` | Get all the user's own transactions (User only)      |

## 🧪 Tech Stack

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for building APIs
- **MongoDB + Mongoose** – NoSQL database and object modeling
- **TypeScript** – Static type checking with JavaScript
- **JWT** – Secure authentication using JSON Web Tokens
- **Bcrypt** – Password hashing for user security
- **Zod** – Runtime validation for request data
- **dotenv**, **cors** – Environment config, CORS support, HTTP request logging


## 🛡️ Security & Validation

- 🔐 **JWT Authentication** – Secure access with token-based authentication and expiration control
- 🔐 **Role-Based Access Control** – Enforced permissions based on roles: `Admin`, `Agent`, and `User`
- ❌ **Robust Validation** – Input data validated using Zod with structured error responses

## 📦 Folder Structure
``` bash
src/
├── app/
│   ├── modules/
│   │   ├── user/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── agent/
│   │   ├── transaction/
│   ├── middleware/
│   ├── utils/
│   └── constants/
├── config/
├── server.ts
├── app.ts

```
## 🚀 Running the Application
To follow all these instructions,the project will run very smothly!