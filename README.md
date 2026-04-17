# Task Management API

A Node.js + Express API for managing tasks with authentication, role-based access, pagination, filtering, and soft delete support.

---

## 🚀 Features

* JWT Authentication (Login/Register)
* Role-based access (Admin / User)
* Task CRUD APIs
* Pagination & Filtering (status, title)
* Soft Delete (isDeleted flag)
* Validation using express-validator
* Secure password hashing (bcrypt)

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* bcrypt
* express-validator

---

## 📦 Installation

```bash
git clone https://github.com/pareshnaik96/task-management.git
cd task-management
npm install
```

---

## ⚙️ Environment Setup

```bash
cp .env.example .env
```

Update values inside `.env`

---

## ▶️ Run Application

```bash
npm run start
```

Server runs at:

```
http://localhost:3000
```

---

##  Seed Admin

```bash
npm run seed:admin
```

Default Admin:

* Email: [admin123@gmail.com](mailto:admin123@gmail.com)
* Password: admin@123

---

##  Authentication

Use Bearer Token:

```
Authorization: Bearer <token>
```

---

## 📌 API Endpoints

### 🔑 Auth

* POST `/auth/register`
* POST `/auth/login`

---

### 📋 Tasks

* POST `/tasks` → Create task
* GET `/tasks` → Get tasks (pagination + filters)
* GET `/tasks/:id` → Get single task (owner only)
* PUT `/tasks/:id` → Update task 
* DELETE `/tasks/:id` → Soft delete

---

## 🔍 Query Params (GET /tasks)

| Param  | Description                        |
| ------ | ---------------------------------- |
| page   | Page number (default: 1)           |
| limit  | Items per page (default: 10)       |
| status | pending / in_progress / completed  |
| title  | Search by title (case-insensitive) |

### Example:

```
GET /tasks?page=1&limit=10&status=pending&title=backend
```

---

## 📤 Response Format

```json
{
  "status": 200,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## 🔒 Access Rules

| Role  | Access         |
| ----- | -------------- |
| User  | Own tasks only |
| Admin | All tasks      |

---

## 🧪 Postman Collection

Import:

`task-management.postman_collection.json`

Includes:

* Auth APIs
* Task APIs
* Auto token handling

---

## 📁 Project Structure

```
src/
 ├── controllers/
 ├── services/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── validations/
 ├── helpers/
 └── config/
```

---

## 👨‍💻 Author

Paresh Naik
