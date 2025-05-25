# 🛒 E-Commerce Web Application

A full-stack E-commerce web application built using **Django** (as the backend) and **React.js** (as the frontend). This platform supports product browsing, cart management, and user authentication, offering a seamless shopping experience.

---

## 📌 Features

- User registration and login 
- Product listing and filtering
- Product detail page
- Add to cart
- Remove from cart
- Razorpay integration for checkout 
- Separate dashboards for frontend (React) and backend (Django Admin)

---

## 🛠 Tech Stack

### 🔹 Backend (Django)
- Python
- Django REST Framework
- MySQL / SQLite
- Django CORS Headers
- Django AllAuth / Custom Auth
- Razorpay API (optional)

### 🔹 Frontend (React)
- React.js
- React Router
- Axios
- Bootstrap 5
- Material Symbols (Google Icons)

---

## 🚀 Getting Started

### 🔧 Backend Setup (Django)

```bash
cd backend

# Create a virtual environment if not already created
python -m venv ecomenv
ecomenv\Scripts\activate    # Windows
# source ecomenv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start backend server
python manage.py runserver
